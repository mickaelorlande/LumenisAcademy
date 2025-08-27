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
        $path = $_SERVER['REQUEST_URI'];
        
        // Rate limiting
        $clientIP = $_SERVER['REMOTE_ADDR'];
        if (!checkRateLimit($clientIP)) {
            http_response_code(429);
            echo json_encode(['error' => 'Muitas tentativas. Tente novamente em alguns minutos.']);
            return;
        }
        
        try {
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (strpos($path, 'register') !== false) {
                    $this->register($input);
                } elseif (strpos($path, 'login') !== false) {
                    $this->login($input);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint não encontrado']);
                }
            } elseif ($method === 'GET') {
                if (strpos($path, 'profile') !== false) {
                    $this->getProfile();
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint não encontrado']);
                }
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método não permitido']);
            }
        } catch (Exception $e) {
            logMessage('ERROR', 'Erro na autenticação: ' . $e->getMessage());
            
            http_response_code(500);
            echo json_encode(['error' => 'Erro interno do servidor']);
        }
    }
    
    private function register($input) {
        // Validar entrada
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
        
        // Verificar se usuário já existe
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email já cadastrado']);
            return;
        }
        
        // Criar usuário
        $uuid = generateUUID();
        $passwordHash = hashPassword($password);
        
        $stmt = $this->db->prepare("
            INSERT INTO users (uuid, email, password_hash, first_name, last_name, neural_profile)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $defaultNeuralProfile = json_encode([
            'plasticidade' => 50,
            'dopamina' => 50,
            'acetilcolina' => 50,
            'serotonina' => 50
        ]);
        
        $stmt->execute([$uuid, $email, $passwordHash, $firstName, $lastName, $defaultNeuralProfile]);
        $userId = $this->db->lastInsertId();
        
        // Gerar token JWT
        $tokenPayload = [
            'user_id' => $userId,
            'email' => $email,
            'exp' => time() + SESSION_LIFETIME
        ];
        
        $token = generateJWT($tokenPayload);
        
        logMessage('INFO', 'Usuário registrado com sucesso', ['user_id' => $userId, 'email' => $email]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Registro realizado com sucesso',
            'token' => $token,
            'user' => [
                'id' => $userId,
                'uuid' => $uuid,
                'email' => $email,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'isPremium' => false
            ]
        ]);
    }
    
    private function login($input) {
        if (!isset($input['email']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email e senha são obrigatórios']);
            return;
        }
        
        $email = sanitizeInput($input['email']);
        $password = $input['password'];
        
        // Buscar usuário
        $stmt = $this->db->prepare("
            SELECT id, uuid, email, password_hash, first_name, last_name, is_premium, 
                   is_active, login_attempts, locked_until
            FROM users 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Credenciais inválidas']);
            return;
        }
        
        // Verificar se conta está bloqueada
        if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
            http_response_code(423);
            echo json_encode(['error' => 'Conta temporariamente bloqueada']);
            return;
        }
        
        // Verificar se conta está ativa
        if (!$user['is_active']) {
            http_response_code(403);
            echo json_encode(['error' => 'Conta desativada']);
            return;
        }
        
        // Verificar senha
        if (!verifyPassword($password, $user['password_hash'])) {
            $this->incrementLoginAttempts($user['id']);
            
            http_response_code(401);
            echo json_encode(['error' => 'Credenciais inválidas']);
            return;
        }
        
        // Reset tentativas de login e atualizar último login
        $stmt = $this->db->prepare("
            UPDATE users 
            SET login_attempts = 0, locked_until = NULL, last_login = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$user['id']]);
        
        // Gerar token JWT
        $tokenPayload = [
            'user_id' => $user['id'],
            'email' => $user['email'],
            'exp' => time() + SESSION_LIFETIME
        ];
        
        $token = generateJWT($tokenPayload);
        
        logMessage('INFO', 'Login realizado com sucesso', ['user_id' => $user['id'], 'email' => $email]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Login realizado com sucesso',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'uuid' => $user['uuid'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'isPremium' => (bool)$user['is_premium']
            ]
        ]);
    }
    
    private function getProfile() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $stmt = $this->db->prepare("
            SELECT uuid, email, first_name, last_name, avatar_url, is_premium, 
                   neural_profile, created_at
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$user['user_id']]);
        $profile = $stmt->fetch();
        
        if (!$profile) {
            http_response_code(404);
            echo json_encode(['error' => 'Perfil não encontrado']);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'profile' => [
                'uuid' => $profile['uuid'],
                'email' => $profile['email'],
                'firstName' => $profile['first_name'],
                'lastName' => $profile['last_name'],
                'avatarUrl' => $profile['avatar_url'],
                'isPremium' => (bool)$profile['is_premium'],
                'neuralProfile' => json_decode($profile['neural_profile'], true),
                'createdAt' => $profile['created_at']
            ]
        ]);
    }
    
    private function authenticateUser() {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Autenticação necessária']);
            return false;
        }
        
        $token = $matches[1];
        $payload = verifyJWT($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido']);
            return false;
        }
        
        return $payload;
    }
    
    private function validateRegistrationInput($input) {
        $errors = [];
        
        if (!isset($input['email']) || !validateEmail($input['email'])) {
            $errors[] = 'Email válido é obrigatório';
        }
        
        if (!isset($input['password']) || strlen($input['password']) < 6) {
            $errors[] = 'Senha deve ter pelo menos 6 caracteres';
        }
        
        if (!isset($input['firstName']) || strlen(trim($input['firstName'])) < 2) {
            $errors[] = 'Nome deve ter pelo menos 2 caracteres';
        }
        
        if (!isset($input['lastName']) || strlen(trim($input['lastName'])) < 2) {
            $errors[] = 'Sobrenome deve ter pelo menos 2 caracteres';
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
}

// Processar requisição
$authController = new AuthController();
$authController->handleRequest();
?>