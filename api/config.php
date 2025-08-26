<?php
// ===== LUMENIS ACADEMY API CONFIGURATION =====

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'lumenis_academy');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Security Configuration
define('JWT_SECRET', 'lumenis_cosmic_secret_key_2025_ultra_secure');
define('ENCRYPTION_KEY', 'lumenis_encryption_key_neural_security');
define('API_VERSION', 'v1');
define('API_BASE_URL', 'http://localhost/lumenis-academy/api');

// Application Configuration
define('APP_NAME', 'Lumenis Academy');
define('APP_VERSION', '2.0.0');
define('APP_ENV', 'development'); // development, production
define('DEBUG_MODE', true);

// Security Headers
define('CORS_ORIGINS', ['http://localhost:3000', 'http://localhost:8080', 'https://lumenisacademy.com']);
define('RATE_LIMIT_REQUESTS', 100);
define('RATE_LIMIT_WINDOW', 3600); // 1 hour

// File Upload Configuration
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_FILE_TYPES', ['pdf', 'mp4', 'jpg', 'jpeg', 'png', 'webp']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Email Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'contato@lumenisacademy.com');
define('SMTP_PASSWORD', 'your_email_password');
define('SMTP_ENCRYPTION', 'tls');

// Payment Configuration (Stripe)
define('STRIPE_PUBLIC_KEY', 'pk_test_your_stripe_public_key');
define('STRIPE_SECRET_KEY', 'sk_test_your_stripe_secret_key');
define('STRIPE_WEBHOOK_SECRET', 'whsec_your_webhook_secret');

// Cache Configuration
define('CACHE_ENABLED', true);
define('CACHE_TTL', 3600); // 1 hour
define('REDIS_HOST', 'localhost');
define('REDIS_PORT', 6379);

// Logging Configuration
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR
define('LOG_PATH', __DIR__ . '/../logs/');

// Neural AI Configuration
define('AI_MODEL_ENDPOINT', 'https://api.openai.com/v1/chat/completions');
define('AI_API_KEY', 'your_openai_api_key');
define('AI_MODEL', 'gpt-4');

// IoT Configuration
define('IOT_MQTT_BROKER', 'mqtt.lumenisacademy.com');
define('IOT_MQTT_PORT', 1883);
define('IOT_DEVICE_TIMEOUT', 30); // seconds

// Session Configuration
define('SESSION_LIFETIME', 7 * 24 * 3600); // 7 days
define('SESSION_SECURE', false); // Set to true in production with HTTPS
define('SESSION_HTTPONLY', true);
define('SESSION_SAMESITE', 'Lax');

// Error Reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Security Functions
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
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

// CORS Headers
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, CORS_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

// Security Headers
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://cdn.jsdelivr.net; style-src \'self\' \'unsafe-inline\' https://cdnjs.cloudflare.com; img-src \'self\' data: https:; font-src \'self\' https://cdnjs.cloudflare.com;');
    
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
}

// Rate Limiting
function checkRateLimit($identifier) {
    $redis = new Redis();
    $redis->connect(REDIS_HOST, REDIS_PORT);
    
    $key = "rate_limit:$identifier";
    $current = $redis->get($key);
    
    if ($current === false) {
        $redis->setex($key, RATE_LIMIT_WINDOW, 1);
        return true;
    }
    
    if ($current >= RATE_LIMIT_REQUESTS) {
        return false;
    }
    
    $redis->incr($key);
    return true;
}

// Logging Function
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

// Database Connection
function getDatabase() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            logMessage('INFO', 'Database connection established');
        } catch (PDOException $e) {
            logMessage('ERROR', 'Database connection failed: ' . $e->getMessage());
            throw new Exception('Database connection failed');
        }
    }
    
    return $pdo;
}

// JWT Token Functions
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

// Initialize
setCorsHeaders();
setSecurityHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>