<?php
require_once 'config.php';

header('Content-Type: application/json');

class CoursesController {
    private $db;
    
    public function __construct() {
        $this->db = getDatabase();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_SERVER['REQUEST_URI'];
        
        try {
            if ($method === 'GET') {
                if (strpos($path, 'courses/') !== false) {
                    // Get specific course
                    $pathParts = explode('/', $path);
                    $courseId = end($pathParts);
                    $this->getCourse($courseId);
                } else {
                    // Get all courses
                    $this->getCourses();
                }
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (strpos($path, 'enroll') !== false) {
                    $this->enrollCourse($input);
                } elseif (strpos($path, 'progress') !== false) {
                    $this->updateProgress($input);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Endpoint não encontrado']);
                }
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método não permitido']);
            }
        } catch (Exception $e) {
            logMessage('ERROR', 'Erro na API de cursos: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro interno do servidor']);
        }
    }
    
    private function getCourses() {
        $category = sanitizeInput($_GET['category'] ?? 'all');
        $limit = min((int)($_GET['limit'] ?? 20), 100);
        $offset = max((int)($_GET['offset'] ?? 0), 0);
        
        $whereConditions = ['is_published = 1'];
        $params = [];
        
        if ($category !== 'all') {
            $whereConditions[] = 'category = ?';
            $params[] = $category;
        }
        
        $whereClause = implode(' AND ', $whereConditions);
        
        $stmt = $this->db->prepare("
            SELECT uuid, title, description, category, level, instructor_name,
                   thumbnail_url, price, is_premium, duration_hours, rating, total_students
            FROM courses
            WHERE $whereClause
            ORDER BY rating DESC, total_students DESC
            LIMIT ? OFFSET ?
        ");
        
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $courses = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'courses' => $courses
        ]);
    }
    
    private function getCourse($courseId) {
        $stmt = $this->db->prepare("
            SELECT uuid, title, description, category, level, instructor_name,
                   thumbnail_url, price, is_premium, duration_hours, rating, total_students
            FROM courses
            WHERE uuid = ? AND is_published = 1
        ");
        $stmt->execute([$courseId]);
        $course = $stmt->fetch();
        
        if (!$course) {
            http_response_code(404);
            echo json_encode(['error' => 'Curso não encontrado']);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'course' => $course
        ]);
    }
    
    private function enrollCourse($input) {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        if (!isset($input['courseId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID do curso é obrigatório']);
            return;
        }
        
        $courseUuid = sanitizeInput($input['courseId']);
        
        // Buscar curso
        $stmt = $this->db->prepare("
            SELECT id, title, is_premium 
            FROM courses 
            WHERE uuid = ? AND is_published = 1
        ");
        $stmt->execute([$courseUuid]);
        $course = $stmt->fetch();
        
        if (!$course) {
            http_response_code(404);
            echo json_encode(['error' => 'Curso não encontrado']);
            return;
        }
        
        // Verificar se já está matriculado
        $stmt = $this->db->prepare("
            SELECT id FROM user_enrollments 
            WHERE user_id = ? AND course_id = ?
        ");
        $stmt->execute([$user['user_id'], $course['id']]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Já matriculado neste curso']);
            return;
        }
        
        // Verificar acesso premium
        if ($course['is_premium']) {
            $stmt = $this->db->prepare("SELECT is_premium FROM users WHERE id = ?");
            $stmt->execute([$user['user_id']]);
            $userPremium = $stmt->fetch();
            
            if (!$userPremium['is_premium']) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso premium necessário']);
                return;
            }
        }
        
        // Matricular usuário
        $stmt = $this->db->prepare("
            INSERT INTO user_enrollments (user_id, course_id, enrollment_date)
            VALUES (?, ?, NOW())
        ");
        $stmt->execute([$user['user_id'], $course['id']]);
        
        logMessage('INFO', 'Usuário matriculado no curso', [
            'user_id' => $user['user_id'],
            'course_id' => $course['id']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Matrícula realizada com sucesso',
            'courseTitle' => $course['title']
        ]);
    }
    
    private function updateProgress($input) {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $required = ['courseId', 'progress'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field é obrigatório"]);
                return;
            }
        }
        
        $courseUuid = sanitizeInput($input['courseId']);
        $progress = max(0, min(100, (float)$input['progress']));
        
        // Buscar curso
        $stmt = $this->db->prepare("SELECT id FROM courses WHERE uuid = ?");
        $stmt->execute([$courseUuid]);
        $course = $stmt->fetch();
        
        if (!$course) {
            http_response_code(404);
            echo json_encode(['error' => 'Curso não encontrado']);
            return;
        }
        
        // Atualizar progresso
        $stmt = $this->db->prepare("
            UPDATE user_enrollments 
            SET progress_percentage = ?, 
                is_completed = CASE WHEN ? >= 100 THEN 1 ELSE 0 END,
                total_study_time = total_study_time + ?
            WHERE user_id = ? AND course_id = ?
        ");
        
        $timeSpent = (int)($input['timeSpent'] ?? 0);
        $stmt->execute([$progress, $progress, $timeSpent, $user['user_id'], $course['id']]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Progresso atualizado com sucesso'
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
}

// Processar requisição
$coursesController = new CoursesController();
$coursesController->handleRequest();
?>