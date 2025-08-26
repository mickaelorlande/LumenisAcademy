<?php
require_once 'config.php';

header('Content-Type: application/json');

class AuthController {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        // Rate limiting
        $clientIP = $_SERVER['REMOTE_ADDR'];
        if (!checkRateLimit($clientIP)) {
            http_response_code(429);
            echo json_encode(['error' => 'Rate limit exceeded']);
            return;
        }
        
        try {
            switch ($method) {
                case 'POST':
                    if (end($pathParts) === 'register') {
                        $this->register();
                    } elseif (end($pathParts) === 'login') {
                        $this->login();
                    } elseif (end($pathParts) === 'refresh') {
                        $this->refreshToken();
                    } elseif (end($pathParts) === 'forgot-password') {
                        $this->forgotPassword();
                    } elseif (end($pathParts) === 'reset-password') {
                        $this->resetPassword();
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Endpoint not found']);
                    }
                    break;
                    
                case 'GET':
                    if (end($pathParts) === 'verify-email') {
                        $this->verifyEmail();
                    } elseif (end($pathParts) === 'profile') {
                        $this->getProfile();
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Endpoint not found']);
                    }
                    break;
                    
                case 'PUT':
                    if (end($pathParts) === 'profile') {
                        $this->updateProfile();
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
            logMessage('ERROR', 'Auth error: ' . $e->getMessage(), [
                'method' => $method,
                'path' => $path,
                'ip' => $clientIP
            ]);
            
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
    
    private function register() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        $errors = $this->validateRegistrationInput($input);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            return;
        }
        
        $email = sanitizeInput($input['email']);
        $password = $input['password'];
        $firstName = sanitizeInput($input['firstName']);
        $lastName = sanitizeInput($input['lastName']);
        
        // Check if user already exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already registered']);
            return;
        }
        
        // Create user
        $uuid = $this->generateUUID();
        $passwordHash = hashPassword($password);
        $emailVerificationToken = generateSecureToken();
        
        $stmt = $this->db->prepare("
            INSERT INTO users (uuid, email, password_hash, first_name, last_name, email_verification_token, neural_profile, learning_preferences)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $defaultNeuralProfile = json_encode([
            'plasticidade' => 50,
            'dopamina' => 50,
            'acetilcolina' => 50,
            'serotonina' => 50
        ]);
        
        $defaultLearningPreferences = json_encode([
            'learning_style' => 'visual',
            'difficulty_preference' => 'adaptive',
            'session_duration' => 30,
            'notifications_enabled' => true
        ]);
        
        $stmt->execute([
            $uuid,
            $email,
            $passwordHash,
            $firstName,
            $lastName,
            $emailVerificationToken,
            $defaultNeuralProfile,
            $defaultLearningPreferences
        ]);
        
        $userId = $this->db->lastInsertId();
        
        // Send verification email (in production)
        if (APP_ENV === 'production') {
            $this->sendVerificationEmail($email, $emailVerificationToken);
        }
        
        // Generate JWT token
        $tokenPayload = [
            'user_id' => $userId,
            'email' => $email,
            'exp' => time() + SESSION_LIFETIME
        ];
        
        $token = generateJWT($tokenPayload);
        
        logMessage('INFO', 'User registered successfully', ['user_id' => $userId, 'email' => $email]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'token' => $token,
            'user' => [
                'id' => $userId,
                'uuid' => $uuid,
                'email' => $email,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'emailVerified' => false,
                'isPremium' => false
            ]
        ]);
    }
    
    private function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['email']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            return;
        }
        
        $email = sanitizeInput($input['email']);
        $password = $input['password'];
        
        // Get user
        $stmt = $this->db->prepare("
            SELECT id, uuid, email, password_hash, first_name, last_name, is_premium, 
                   email_verified, is_active, login_attempts, locked_until, neural_profile
            FROM users 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }
        
        // Check if account is locked
        if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
            http_response_code(423);
            echo json_encode(['error' => 'Account temporarily locked']);
            return;
        }
        
        // Check if account is active
        if (!$user['is_active']) {
            http_response_code(403);
            echo json_encode(['error' => 'Account deactivated']);
            return;
        }
        
        // Verify password
        if (!verifyPassword($password, $user['password_hash'])) {
            // Increment login attempts
            $this->incrementLoginAttempts($user['id']);
            
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
            return;
        }
        
        // Reset login attempts and update last login
        $stmt = $this->db->prepare("
            UPDATE users 
            SET login_attempts = 0, locked_until = NULL, last_login = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$user['id']]);
        
        // Generate JWT token
        $tokenPayload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'exp' => time() + SESSION_LIFETIME
        ];
        
        $token = generateJWT($tokenPayload);
        
        logMessage('INFO', 'User logged in successfully', ['user_id' => $user['id'], 'email' => $email]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'uuid' => $user['uuid'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'emailVerified' => (bool)$user['email_verified'],
                'isPremium' => (bool)$user['is_premium'],
                'neuralProfile' => json_decode($user['neural_profile'], true)
            ]
        ]);
    }
    
    private function refreshToken() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Token required']);
            return;
        }
        
        $token = $matches[1];
        $payload = verifyJWT($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token']);
            return;
        }
        
        // Generate new token
        $newTokenPayload = [
            'user_id' => $payload['user_id'],
            'email' => $payload['email'],
            'exp' => time() + SESSION_LIFETIME
        ];
        
        $newToken = generateJWT($newTokenPayload);
        
        echo json_encode([
            'success' => true,
            'token' => $newToken
        ]);
    }
    
    private function forgotPassword() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email required']);
            return;
        }
        
        $email = sanitizeInput($input['email']);
        
        // Check if user exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user) {
            $resetToken = generateSecureToken();
            $resetExpires = date('Y-m-d H:i:s', time() + 3600); // 1 hour
            
            $stmt = $this->db->prepare("
                UPDATE users 
                SET password_reset_token = ?, password_reset_expires = ? 
                WHERE id = ?
            ");
            $stmt->execute([$resetToken, $resetExpires, $user['id']]);
            
            // Send reset email (in production)
            if (APP_ENV === 'production') {
                $this->sendPasswordResetEmail($email, $resetToken);
            }
            
            logMessage('INFO', 'Password reset requested', ['email' => $email]);
        }
        
        // Always return success to prevent email enumeration
        echo json_encode([
            'success' => true,
            'message' => 'If the email exists, a reset link has been sent'
        ]);
    }
    
    private function resetPassword() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['token']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Token and password required']);
            return;
        }
        
        $token = sanitizeInput($input['token']);
        $password = $input['password'];
        
        // Validate password
        if (strlen($password) < 8) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 8 characters']);
            return;
        }
        
        // Find user with valid reset token
        $stmt = $this->db->prepare("
            SELECT id FROM users 
            WHERE password_reset_token = ? 
            AND password_reset_expires > NOW() 
            AND is_active = 1
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid or expired reset token']);
            return;
        }
        
        // Update password
        $passwordHash = hashPassword($password);
        
        $stmt = $this->db->prepare("
            UPDATE users 
            SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL 
            WHERE id = ?
        ");
        $stmt->execute([$passwordHash, $user['id']]);
        
        logMessage('INFO', 'Password reset successfully', ['user_id' => $user['id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Password reset successful'
        ]);
    }
    
    private function verifyEmail() {
        $token = $_GET['token'] ?? '';
        
        if (!$token) {
            http_response_code(400);
            echo json_encode(['error' => 'Verification token required']);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT id FROM users 
            WHERE email_verification_token = ? AND email_verified = 0
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid verification token']);
            return;
        }
        
        // Mark email as verified
        $stmt = $this->db->prepare("
            UPDATE users 
            SET email_verified = 1, email_verification_token = NULL 
            WHERE id = ?
        ");
        $stmt->execute([$user['id']]);
        
        logMessage('INFO', 'Email verified successfully', ['user_id' => $user['id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Email verified successfully'
        ]);
    }
    
    private function getProfile() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $stmt = $this->db->prepare("
            SELECT uuid, email, first_name, last_name, avatar_url, birth_date, 
                   phone, bio, is_premium, premium_expires_at, neural_profile, 
                   learning_preferences, email_verified, created_at
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$user['user_id']]);
        $profile = $stmt->fetch();
        
        if (!$profile) {
            http_response_code(404);
            echo json_encode(['error' => 'Profile not found']);
            return;
        }
        
        // Get user statistics
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(DISTINCT ue.course_id) as enrolled_courses,
                COUNT(DISTINCT CASE WHEN ue.is_completed = 1 THEN ue.course_id END) as completed_courses,
                AVG(ue.progress_percentage) as avg_progress,
                SUM(ue.total_study_time) as total_study_time,
                COUNT(DISTINCT ua.achievement_id) as total_achievements
            FROM users u
            LEFT JOIN user_enrollments ue ON u.id = ue.user_id
            LEFT JOIN user_achievements ua ON u.id = ua.user_id AND ua.is_unlocked = 1
            WHERE u.id = ?
        ");
        $stmt->execute([$user['user_id']]);
        $stats = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'profile' => [
                'uuid' => $profile['uuid'],
                'email' => $profile['email'],
                'firstName' => $profile['first_name'],
                'lastName' => $profile['last_name'],
                'avatarUrl' => $profile['avatar_url'],
                'birthDate' => $profile['birth_date'],
                'phone' => $profile['phone'],
                'bio' => $profile['bio'],
                'isPremium' => (bool)$profile['is_premium'],
                'premiumExpiresAt' => $profile['premium_expires_at'],
                'neuralProfile' => json_decode($profile['neural_profile'], true),
                'learningPreferences' => json_decode($profile['learning_preferences'], true),
                'emailVerified' => (bool)$profile['email_verified'],
                'createdAt' => $profile['created_at']
            ],
            'stats' => [
                'enrolledCourses' => (int)$stats['enrolled_courses'],
                'completedCourses' => (int)$stats['completed_courses'],
                'avgProgress' => round($stats['avg_progress'], 2),
                'totalStudyTime' => (int)$stats['total_study_time'],
                'totalAchievements' => (int)$stats['total_achievements']
            ]
        ]);
    }
    
    private function updateProfile() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        $allowedFields = ['first_name', 'last_name', 'bio', 'phone', 'birth_date', 'learning_preferences'];
        $updateFields = [];
        $updateValues = [];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateFields[] = "$field = ?";
                
                if ($field === 'learning_preferences') {
                    $updateValues[] = json_encode($input[$field]);
                } else {
                    $updateValues[] = sanitizeInput($input[$field]);
                }
            }
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields to update']);
            return;
        }
        
        $updateValues[] = $user['user_id'];
        
        $stmt = $this->db->prepare("
            UPDATE users 
            SET " . implode(', ', $updateFields) . ", updated_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute($updateValues);
        
        logMessage('INFO', 'Profile updated successfully', ['user_id' => $user['user_id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
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
    
    private function validateRegistrationInput($input) {
        $errors = [];
        
        if (!isset($input['email']) || !validateEmail($input['email'])) {
            $errors[] = 'Valid email required';
        }
        
        if (!isset($input['password']) || strlen($input['password']) < 8) {
            $errors[] = 'Password must be at least 8 characters';
        }
        
        if (!isset($input['firstName']) || strlen(trim($input['firstName'])) < 2) {
            $errors[] = 'First name must be at least 2 characters';
        }
        
        if (!isset($input['lastName']) || strlen(trim($input['lastName'])) < 2) {
            $errors[] = 'Last name must be at least 2 characters';
        }
        
        // Password strength validation
        if (isset($input['password'])) {
            $password = $input['password'];
            if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/', $password)) {
                $errors[] = 'Password must contain uppercase, lowercase, number and special character';
            }
        }
        
        return $errors;
    }
    
    private function incrementLoginAttempts($userId) {
        $stmt = $this->db->prepare("
            UPDATE users 
            SET login_attempts = login_attempts + 1,
                locked_until = CASE 
                    WHEN login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 30 MINUTE)
                    ELSE locked_until 
                END
            WHERE id = ?
        ");
        $stmt->execute([$userId]);
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
    
    private function sendVerificationEmail($email, $token) {
        // Implementation for sending verification email
        // This would use PHPMailer or similar in production
        logMessage('INFO', 'Verification email sent', ['email' => $email]);
    }
    
    private function sendPasswordResetEmail($email, $token) {
        // Implementation for sending password reset email
        logMessage('INFO', 'Password reset email sent', ['email' => $email]);
    }
}

// Handle the request
$authController = new AuthController();
$authController->handleRequest();
?>