<?php
require_once 'config.php';

header('Content-Type: application/json');

class PaymentsController {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        try {
            switch ($method) {
                case 'POST':
                    if (end($pathParts) === 'create-payment-intent') {
                        $this->createPaymentIntent();
                    } elseif (end($pathParts) === 'confirm-payment') {
                        $this->confirmPayment();
                    } elseif (end($pathParts) === 'webhook') {
                        $this->handleWebhook();
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Endpoint not found']);
                    }
                    break;
                    
                case 'GET':
                    if (end($pathParts) === 'history') {
                        $this->getPaymentHistory();
                    } elseif (end($pathParts) === 'plans') {
                        $this->getPlans();
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Endpoint not found']);
                    }
                    break;
                    
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed']);
            }
        } catch (Exception $e) {
            logMessage('ERROR', 'Payments API error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
    
    private function createPaymentIntent() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['planType'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Plan type required']);
            return;
        }
        
        $planType = sanitizeInput($input['planType']);
        $planDetails = $this->getPlanDetails($planType);
        
        if (!$planDetails) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid plan type']);
            return;
        }
        
        // Create payment record
        $paymentUuid = $this->generateUUID();
        
        $stmt = $this->db->prepare("
            INSERT INTO payments (uuid, user_id, plan_type, amount, currency, payment_method, status, metadata)
            VALUES (?, ?, ?, ?, 'BRL', 'credit_card', 'pending', ?)
        ");
        
        $metadata = json_encode([
            'plan_details' => $planDetails,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? ''
        ]);
        
        $stmt->execute([
            $paymentUuid,
            $user['user_id'],
            $planType,
            $planDetails['price'],
            $metadata
        ]);
        
        // In production, integrate with Stripe
        $clientSecret = $this->createStripePaymentIntent($planDetails['price'], $paymentUuid);
        
        logMessage('INFO', 'Payment intent created', [
            'user_id' => $user['user_id'],
            'plan_type' => $planType,
            'amount' => $planDetails['price']
        ]);
        
        echo json_encode([
            'success' => true,
            'paymentId' => $paymentUuid,
            'clientSecret' => $clientSecret,
            'amount' => $planDetails['price'],
            'currency' => 'BRL'
        ]);
    }
    
    private function confirmPayment() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['paymentId']) || !isset($input['paymentIntentId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Payment ID and Payment Intent ID required']);
            return;
        }
        
        $paymentUuid = sanitizeInput($input['paymentId']);
        $paymentIntentId = sanitizeInput($input['paymentIntentId']);
        
        // Get payment record
        $stmt = $this->db->prepare("
            SELECT id, plan_type, amount, status
            FROM payments 
            WHERE uuid = ? AND user_id = ?
        ");
        $stmt->execute([$paymentUuid, $user['user_id']]);
        $payment = $stmt->fetch();
        
        if (!$payment) {
            http_response_code(404);
            echo json_encode(['error' => 'Payment not found']);
            return;
        }
        
        if ($payment['status'] !== 'pending') {
            http_response_code(400);
            echo json_encode(['error' => 'Payment already processed']);
            return;
        }
        
        // Verify payment with Stripe (in production)
        $paymentVerified = $this->verifyStripePayment($paymentIntentId);
        
        if ($paymentVerified) {
            // Update payment status
            $stmt = $this->db->prepare("
                UPDATE payments 
                SET status = 'completed', provider_payment_id = ?, paid_at = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$paymentIntentId, $payment['id']]);
            
            // Activate premium access
            $this->activatePremiumAccess($user['user_id'], $payment['plan_type']);
            
            logMessage('INFO', 'Payment confirmed successfully', [
                'user_id' => $user['user_id'],
                'payment_id' => $payment['id'],
                'plan_type' => $payment['plan_type']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Payment confirmed successfully',
                'premiumActivated' => true
            ]);
        } else {
            // Update payment status to failed
            $stmt = $this->db->prepare("
                UPDATE payments 
                SET status = 'failed'
                WHERE id = ?
            ");
            $stmt->execute([$payment['id']]);
            
            http_response_code(400);
            echo json_encode(['error' => 'Payment verification failed']);
        }
    }
    
    private function activatePremiumAccess($userId, $planType) {
        // Set premium access (lifetime for all plans)
        $stmt = $this->db->prepare("
            UPDATE users 
            SET is_premium = 1, premium_expires_at = NULL, updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->execute([$userId]);
        
        // Grant access to specific course categories based on plan
        $this->grantCourseAccess($userId, $planType);
    }
    
    private function grantCourseAccess($userId, $planType) {
        $courseCategories = [];
        
        switch ($planType) {
            case 'technology':
                $courseCategories = ['technology'];
                break;
            case 'autodidata':
                $courseCategories = ['autodidata'];
                break;
            case 'ultimate':
                $courseCategories = ['technology', 'autodidata'];
                break;
        }
        
        foreach ($courseCategories as $category) {
            $stmt = $this->db->prepare("
                INSERT IGNORE INTO user_enrollments (user_id, course_id, enrollment_date)
                SELECT ?, c.id, NOW()
                FROM courses c
                WHERE c.category = ? AND c.is_premium = 1 AND c.is_published = 1
            ");
            $stmt->execute([$userId, $category]);
        }
    }
    
    private function getPaymentHistory() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $stmt = $this->db->prepare("
            SELECT 
                uuid, plan_type, amount, currency, payment_method,
                status, paid_at, created_at
            FROM payments
            WHERE user_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$user['user_id']]);
        $payments = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'payments' => $payments
        ]);
    }
    
    private function getPlans() {
        $plans = [
            [
                'id' => 'technology',
                'name' => 'Tecnologia Premium',
                'description' => 'Acesso completo aos cursos de tecnologia',
                'price' => 297,
                'currency' => 'BRL',
                'features' => [
                    'Todos os cursos de Tecnologia',
                    'Certificados reconhecidos',
                    'Projetos práticos',
                    'Mentoria especializada',
                    'Acesso vitalício'
                ],
                'popular' => false
            ],
            [
                'id' => 'autodidata',
                'name' => 'Autodidata Premium',
                'description' => 'Para autodidatas que buscam conhecimento avançado',
                'price' => 497,
                'currency' => 'BRL',
                'features' => [
                    'Todos os cursos Autodidatas',
                    'IA Tutor personalizada',
                    'Biblioteca premium',
                    'Artigos científicos',
                    'Comunidade exclusiva',
                    'Acesso vitalício'
                ],
                'popular' => true
            ],
            [
                'id' => 'ultimate',
                'name' => 'Lumenis Ultimate',
                'description' => 'Experiência completa da plataforma',
                'price' => 697,
                'currency' => 'BRL',
                'features' => [
                    'Acesso completo à plataforma',
                    'Todos os recursos premium',
                    'IoT Learning Kit',
                    'Consultoria 1:1',
                    'Acesso antecipado',
                    'Suporte prioritário',
                    'Acesso vitalício'
                ],
                'popular' => false
            ]
        ];
        
        echo json_encode([
            'success' => true,
            'plans' => $plans
        ]);
    }
    
    private function handleWebhook() {
        $payload = file_get_contents('php://input');
        $sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
        
        // Verify webhook signature (in production)
        if (!$this->verifyWebhookSignature($payload, $sigHeader)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid signature']);
            return;
        }
        
        $event = json_decode($payload, true);
        
        switch ($event['type']) {
            case 'payment_intent.succeeded':
                $this->handlePaymentSuccess($event['data']['object']);
                break;
                
            case 'payment_intent.payment_failed':
                $this->handlePaymentFailure($event['data']['object']);
                break;
                
            default:
                logMessage('INFO', 'Unhandled webhook event', ['type' => $event['type']]);
        }
        
        echo json_encode(['success' => true]);
    }
    
    private function handlePaymentSuccess($paymentIntent) {
        $paymentId = $paymentIntent['metadata']['payment_id'] ?? null;
        
        if (!$paymentId) {
            logMessage('ERROR', 'Payment ID not found in webhook metadata');
            return;
        }
        
        $stmt = $this->db->prepare("
            UPDATE payments 
            SET status = 'completed', provider_payment_id = ?, paid_at = NOW()
            WHERE uuid = ?
        ");
        $stmt->execute([$paymentIntent['id'], $paymentId]);
        
        // Get payment details
        $stmt = $this->db->prepare("
            SELECT user_id, plan_type FROM payments WHERE uuid = ?
        ");
        $stmt->execute([$paymentId]);
        $payment = $stmt->fetch();
        
        if ($payment) {
            $this->activatePremiumAccess($payment['user_id'], $payment['plan_type']);
            
            logMessage('INFO', 'Premium access activated via webhook', [
                'user_id' => $payment['user_id'],
                'plan_type' => $payment['plan_type']
            ]);
        }
    }
    
    private function handlePaymentFailure($paymentIntent) {
        $paymentId = $paymentIntent['metadata']['payment_id'] ?? null;
        
        if ($paymentId) {
            $stmt = $this->db->prepare("
                UPDATE payments 
                SET status = 'failed'
                WHERE uuid = ?
            ");
            $stmt->execute([$paymentId]);
            
            logMessage('WARNING', 'Payment failed', ['payment_id' => $paymentId]);
        }
    }
    
    private function getPlanDetails($planType) {
        $plans = [
            'technology' => [
                'name' => 'Tecnologia Premium',
                'price' => 297,
                'features' => ['Todos os cursos de Tecnologia', 'Certificados', 'Projetos práticos']
            ],
            'autodidata' => [
                'name' => 'Autodidata Premium',
                'price' => 497,
                'features' => ['Todos os cursos Autodidatas', 'IA Tutor', 'Biblioteca premium']
            ],
            'ultimate' => [
                'name' => 'Lumenis Ultimate',
                'price' => 697,
                'features' => ['Acesso completo', 'IoT Kit', 'Consultoria 1:1']
            ]
        ];
        
        return $plans[$planType] ?? null;
    }
    
    private function createStripePaymentIntent($amount, $paymentId) {
        // In production, this would create a real Stripe Payment Intent
        // For now, return a mock client secret
        return 'pi_mock_' . uniqid() . '_secret_mock';
    }
    
    private function verifyStripePayment($paymentIntentId) {
        // In production, this would verify with Stripe API
        // For development, simulate successful verification
        return true;
    }
    
    private function verifyWebhookSignature($payload, $signature) {
        // In production, verify Stripe webhook signature
        return true;
    }
    
    private function generateUUID() {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
    
    private function authenticateUser() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication required']);
            return false;
        }
        
        $token = $matches[1];
        $payload = verifyJWT($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token']);
            return false;
        }
        
        return $payload;
    }
}

// Handle the request
$paymentsController = new PaymentsController();
$paymentsController->handleRequest();
?>