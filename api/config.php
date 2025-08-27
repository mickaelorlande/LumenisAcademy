<?php
// ===== CONFIGURAÇÃO LUMENIS ACADEMY - SIMPLIFICADA =====

// Configuração do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'lumenis_academy');
define('DB_USER', 'root');
define('DB_PASS', ''); // Senha vazia para XAMPP padrão
define('DB_CHARSET', 'utf8mb4');

// Configuração da Aplicação
define('APP_NAME', 'Lumenis Academy');
define('APP_VERSION', '2.0.0');
define('APP_ENV', 'development');
define('DEBUG_MODE', true);

// Configuração de Segurança
define('JWT_SECRET', 'lumenis_secret_key_2025_ultra_secure_cosmic');
define('SESSION_LIFETIME', 7 * 24 * 3600); // 7 dias

// Configuração de Upload
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Configuração de Log
define('LOG_PATH', __DIR__ . '/../logs/');

// Configuração de Erro
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// ===== FUNÇÕES DE SEGURANÇA =====
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function generateSecureToken($length = 32) {
    return bin2hex(random_bytes($length));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_ARGON2ID, [
        'memory_cost' => 65536,
        'time_cost' => 4,
        'threads' => 3
    ]);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function generateUUID() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// ===== HEADERS DE SEGURANÇA =====
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    // CORS para desenvolvimento local
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
}

// ===== CONEXÃO COM BANCO DE DADOS =====
function getDatabase() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            logMessage('INFO', 'Conexão com banco estabelecida');
        } catch (PDOException $e) {
            logMessage('ERROR', 'Falha na conexão: ' . $e->getMessage());
            
            if (DEBUG_MODE) {
                die('Erro de conexão com banco: ' . $e->getMessage());
            } else {
                die('Erro interno do servidor');
            }
        }
    }
    
    return $pdo;
}

// ===== FUNÇÕES JWT =====
function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($payload);
    
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
    $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[2]));
    
    $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], JWT_SECRET, true);
    
    if (!hash_equals($signature, $expectedSignature)) {
        return false;
    }
    
    $payloadData = json_decode($payload, true);
    
    if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}

// ===== FUNÇÃO DE LOG =====
function logMessage($level, $message, $context = []) {
    if (!is_dir(LOG_PATH)) {
        mkdir(LOG_PATH, 0755, true);
    }
    
    $logFile = LOG_PATH . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    $contextStr = !empty($context) ? json_encode($context) : '';
    
    $logEntry = "[$timestamp] [$level] $message $contextStr" . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// ===== RATE LIMITING SIMPLES =====
function checkRateLimit($identifier, $maxRequests = 100, $timeWindow = 3600) {
    $cacheFile = sys_get_temp_dir() . "/rate_limit_$identifier";
    
    if (file_exists($cacheFile)) {
        $data = json_decode(file_get_contents($cacheFile), true);
        
        if ($data['timestamp'] + $timeWindow > time()) {
            if ($data['count'] >= $maxRequests) {
                return false;
            }
            $data['count']++;
        } else {
            $data = ['count' => 1, 'timestamp' => time()];
        }
    } else {
        $data = ['count' => 1, 'timestamp' => time()];
    }
    
    file_put_contents($cacheFile, json_encode($data));
    return true;
}

// ===== INICIALIZAÇÃO =====
setSecurityHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar conexão com banco na inicialização
try {
    getDatabase();
} catch (Exception $e) {
    if (DEBUG_MODE) {
        echo "Erro de configuração do banco: " . $e->getMessage();
    }
}
?>