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
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        
        try {
            switch ($method) {
                case 'GET':
                    if (isset($pathParts[2])) {
                        $this->getCourse($pathParts[2]);
                    } else {
                        $this->getCourses();
                    }
                    break;
                    
                case 'POST':
                    if (end($pathParts) === 'enroll') {
                        $this->enrollCourse();
                    } elseif (end($pathParts) === 'progress') {
                        $this->updateProgress();
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
            logMessage('ERROR', 'Courses API error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
    
    private function getCourses() {
        $category = $_GET['category'] ?? 'all';
        $limit = min((int)($_GET['limit'] ?? 20), 100);
        $offset = max((int)($_GET['offset'] ?? 0), 0);
        $search = sanitizeInput($_GET['search'] ?? '');
        
        $whereConditions = ['c.is_published = 1'];
        $params = [];
        
        if ($category !== 'all') {
            $whereConditions[] = 'c.category = ?';
            $params[] = $category;
        }
        
        if ($search) {
            $whereConditions[] = '(c.title LIKE ? OR c.description LIKE ?)';
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        
        $whereClause = implode(' AND ', $whereConditions);
        
        $stmt = $this->db->prepare("
            SELECT 
                c.uuid, c.title, c.slug, c.description, c.short_description,
                c.category, c.level, c.thumbnail_url, c.price, c.is_premium,
                c.duration_hours, c.total_lessons, c.rating, c.total_students,
                CONCAT(u.first_name, ' ', u.last_name) as instructor_name,
                u.avatar_url as instructor_avatar
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            WHERE $whereClause
            ORDER BY c.rating DESC, c.total_students DESC
            LIMIT ? OFFSET ?
        ");
        
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $courses = $stmt->fetchAll();
        
        // Get total count
        $countStmt = $this->db->prepare("
            SELECT COUNT(*) as total
            FROM courses c
            WHERE $whereClause
        ");
        $countStmt->execute(array_slice($params, 0, -2));
        $total = $countStmt->fetch()['total'];
        
        echo json_encode([
            'success' => true,
            'courses' => $courses,
            'pagination' => [
                'total' => (int)$total,
                'limit' => $limit,
                'offset' => $offset,
                'hasMore' => ($offset + $limit) < $total
            ]
        ]);
    }
    
    private function getCourse($courseId) {
        // Get course details
        $stmt = $this->db->prepare("
            SELECT 
                c.uuid, c.title, c.slug, c.description, c.category, c.level,
                c.thumbnail_url, c.trailer_url, c.price, c.is_premium,
                c.duration_hours, c.total_lessons, c.rating, c.total_students,
                c.neural_tags, c.learning_objectives, c.prerequisites,
                CONCAT(u.first_name, ' ', u.last_name) as instructor_name,
                u.avatar_url as instructor_avatar, u.bio as instructor_bio
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            WHERE c.uuid = ? AND c.is_published = 1
        ");
        $stmt->execute([$courseId]);
        $course = $stmt->fetch();
        
        if (!$course) {
            http_response_code(404);
            echo json_encode(['error' => 'Course not found']);
            return;
        }
        
        // Get modules and lessons
        $stmt = $this->db->prepare("
            SELECT 
                m.uuid as module_uuid, m.title as module_title, m.description as module_description,
                m.order_index as module_order,
                l.uuid as lesson_uuid, l.title as lesson_title, l.description as lesson_description,
                l.content_type, l.duration_minutes, l.order_index as lesson_order,
                l.neural_difficulty, l.is_free
            FROM course_modules m
            LEFT JOIN lessons l ON m.id = l.module_id AND l.is_published = 1
            WHERE m.course_id = (SELECT id FROM courses WHERE uuid = ?)
            ORDER BY m.order_index, l.order_index
        ");
        $stmt->execute([$courseId]);
        $moduleData = $stmt->fetchAll();
        
        // Organize modules and lessons
        $modules = [];
        $currentModule = null;
        
        foreach ($moduleData as $row) {
            if (!$currentModule || $currentModule['uuid'] !== $row['module_uuid']) {
                if ($currentModule) {
                    $modules[] = $currentModule;
                }
                
                $currentModule = [
                    'uuid' => $row['module_uuid'],
                    'title' => $row['module_title'],
                    'description' => $row['module_description'],
                    'order' => $row['module_order'],
                    'lessons' => []
                ];
            }
            
            if ($row['lesson_uuid']) {
                $currentModule['lessons'][] = [
                    'uuid' => $row['lesson_uuid'],
                    'title' => $row['lesson_title'],
                    'description' => $row['lesson_description'],
                    'contentType' => $row['content_type'],
                    'duration' => $row['duration_minutes'],
                    'order' => $row['lesson_order'],
                    'neuralDifficulty' => $row['neural_difficulty'],
                    'isFree' => (bool)$row['is_free']
                ];
            }
        }
        
        if ($currentModule) {
            $modules[] = $currentModule;
        }
        
        // Get reviews (sample data for now)
        $reviews = [
            [
                'userName' => 'Ana Silva',
                'userAvatar' => 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=50',
                'rating' => 5,
                'comment' => 'Curso excepcional! A metodologia neurocientífica realmente funciona.',
                'date' => '2025-01-15'
            ],
            [
                'userName' => 'Carlos Santos',
                'userAvatar' => 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=50',
                'rating' => 4.5,
                'comment' => 'Conteúdo muito bem estruturado e professor excelente.',
                'date' => '2025-01-10'
            ]
        ];
        
        echo json_encode([
            'success' => true,
            'course' => [
                'uuid' => $course['uuid'],
                'title' => $course['title'],
                'slug' => $course['slug'],
                'description' => $course['description'],
                'category' => $course['category'],
                'level' => $course['level'],
                'thumbnailUrl' => $course['thumbnail_url'],
                'trailerUrl' => $course['trailer_url'],
                'price' => (float)$course['price'],
                'isPremium' => (bool)$course['is_premium'],
                'duration' => $course['duration_hours'],
                'totalLessons' => $course['total_lessons'],
                'rating' => (float)$course['rating'],
                'totalStudents' => $course['total_students'],
                'neuralTags' => json_decode($course['neural_tags'], true),
                'learningObjectives' => json_decode($course['learning_objectives'], true),
                'prerequisites' => json_decode($course['prerequisites'], true),
                'instructor' => [
                    'name' => $course['instructor_name'],
                    'avatar' => $course['instructor_avatar'],
                    'bio' => $course['instructor_bio']
                ],
                'modules' => $modules,
                'reviews' => $reviews
            ]
        ]);
    }
    
    private function enrollCourse() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['courseId'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Course ID required']);
            return;
        }
        
        $courseUuid = sanitizeInput($input['courseId']);
        
        // Get course
        $stmt = $this->db->prepare("
            SELECT id, title, is_premium, price 
            FROM courses 
            WHERE uuid = ? AND is_published = 1
        ");
        $stmt->execute([$courseUuid]);
        $course = $stmt->fetch();
        
        if (!$course) {
            http_response_code(404);
            echo json_encode(['error' => 'Course not found']);
            return;
        }
        
        // Check if user is already enrolled
        $stmt = $this->db->prepare("
            SELECT id FROM user_enrollments 
            WHERE user_id = ? AND course_id = ?
        ");
        $stmt->execute([$user['user_id'], $course['id']]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Already enrolled in this course']);
            return;
        }
        
        // Check premium access
        if ($course['is_premium']) {
            $stmt = $this->db->prepare("
                SELECT is_premium, premium_expires_at 
                FROM users 
                WHERE id = ?
            ");
            $stmt->execute([$user['user_id']]);
            $userPremium = $stmt->fetch();
            
            if (!$userPremium['is_premium'] || 
                ($userPremium['premium_expires_at'] && strtotime($userPremium['premium_expires_at']) < time())) {
                http_response_code(403);
                echo json_encode(['error' => 'Premium access required']);
                return;
            }
        }
        
        // Enroll user
        $stmt = $this->db->prepare("
            INSERT INTO user_enrollments (user_id, course_id, enrollment_date, neural_progress)
            VALUES (?, ?, NOW(), ?)
        ");
        
        $initialNeuralProgress = json_encode([
            'initial_assessment' => null,
            'learning_path' => 'adaptive',
            'difficulty_adjustments' => []
        ]);
        
        $stmt->execute([$user['user_id'], $course['id'], $initialNeuralProgress]);
        
        logMessage('INFO', 'User enrolled in course', [
            'user_id' => $user['user_id'],
            'course_id' => $course['id']
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Enrollment successful',
            'courseTitle' => $course['title']
        ]);
    }
    
    private function updateProgress() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        $required = ['lessonId', 'progress', 'timeSpent'];
        foreach ($required as $field) {
            if (!isset($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "$field is required"]);
                return;
            }
        }
        
        $lessonUuid = sanitizeInput($input['lessonId']);
        $progress = max(0, min(100, (float)$input['progress']));
        $timeSpent = max(0, (int)$input['timeSpent']);
        $neuralMetrics = $input['neuralMetrics'] ?? null;
        
        // Get lesson
        $stmt = $this->db->prepare("
            SELECT l.id, l.module_id, m.course_id
            FROM lessons l
            JOIN course_modules m ON l.module_id = m.id
            WHERE l.uuid = ?
        ");
        $stmt->execute([$lessonUuid]);
        $lesson = $stmt->fetch();
        
        if (!$lesson) {
            http_response_code(404);
            echo json_encode(['error' => 'Lesson not found']);
            return;
        }
        
        // Check enrollment
        $stmt = $this->db->prepare("
            SELECT id FROM user_enrollments 
            WHERE user_id = ? AND course_id = ?
        ");
        $stmt->execute([$user['user_id'], $lesson['course_id']]);
        
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'Not enrolled in this course']);
            return;
        }
        
        // Update lesson progress
        $status = $progress >= 100 ? 'completed' : ($progress > 0 ? 'in_progress' : 'not_started');
        
        $stmt = $this->db->prepare("
            INSERT INTO lesson_progress 
            (user_id, lesson_id, status, progress_percentage, time_spent, neural_metrics, started_at, completed_at, last_accessed)
            VALUES (?, ?, ?, ?, ?, ?, 
                CASE WHEN ? > 0 AND started_at IS NULL THEN NOW() ELSE started_at END,
                CASE WHEN ? >= 100 THEN NOW() ELSE NULL END,
                NOW())
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                progress_percentage = GREATEST(progress_percentage, VALUES(progress_percentage)),
                time_spent = time_spent + VALUES(time_spent),
                neural_metrics = VALUES(neural_metrics),
                completed_at = CASE WHEN VALUES(progress_percentage) >= 100 AND completed_at IS NULL THEN NOW() ELSE completed_at END,
                last_accessed = NOW()
        ");
        
        $neuralMetricsJson = $neuralMetrics ? json_encode($neuralMetrics) : null;
        $stmt->execute([
            $user['user_id'], $lesson['id'], $status, $progress, $timeSpent, 
            $neuralMetricsJson, $progress, $progress
        ]);
        
        // Update course progress
        $this->updateCourseProgress($user['user_id'], $lesson['course_id']);
        
        // Store neural metrics if provided
        if ($neuralMetrics) {
            $this->storeNeuralMetrics($user['user_id'], $neuralMetrics);
        }
        
        // Check for achievements
        $this->checkAchievements($user['user_id']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Progress updated successfully'
        ]);
    }
    
    private function updateCourseProgress($userId, $courseId) {
        // Calculate overall course progress
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(*) as total_lessons,
                COUNT(CASE WHEN lp.status = 'completed' THEN 1 END) as completed_lessons,
                AVG(lp.progress_percentage) as avg_progress,
                SUM(lp.time_spent) as total_time
            FROM lessons l
            JOIN course_modules m ON l.module_id = m.id
            LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ?
            WHERE m.course_id = ?
        ");
        $stmt->execute([$userId, $courseId]);
        $stats = $stmt->fetch();
        
        $overallProgress = $stats['avg_progress'] ?: 0;
        $isCompleted = $stats['completed_lessons'] == $stats['total_lessons'] && $stats['total_lessons'] > 0;
        
        $stmt = $this->db->prepare("
            UPDATE user_enrollments 
            SET 
                progress_percentage = ?,
                total_study_time = ?,
                is_completed = ?,
                completion_date = CASE WHEN ? = 1 AND completion_date IS NULL THEN NOW() ELSE completion_date END,
                last_accessed = NOW()
            WHERE user_id = ? AND course_id = ?
        ");
        $stmt->execute([$overallProgress, $stats['total_time'], $isCompleted, $isCompleted, $userId, $courseId]);
    }
    
    private function storeNeuralMetrics($userId, $metrics) {
        $sessionId = session_id() ?: uniqid('session_', true);
        
        foreach ($metrics as $type => $value) {
            if (in_array($type, ['focus', 'attention', 'stress', 'engagement', 'dopamine', 'acetylcholine', 'serotonina'])) {
                $stmt = $this->db->prepare("
                    INSERT INTO neural_metrics (user_id, session_id, metric_type, value, recorded_at)
                    VALUES (?, ?, ?, ?, NOW())
                ");
                $stmt->execute([$userId, $sessionId, $type, $value]);
            }
        }
        
        // Update user neural profile
        $stmt = $this->db->prepare("
            UPDATE users 
            SET neural_profile = JSON_SET(
                COALESCE(neural_profile, '{}'),
                '$.last_update', NOW(),
                '$.metrics', ?
            )
            WHERE id = ?
        ");
        $stmt->execute([json_encode($metrics), $userId]);
    }
    
    private function checkAchievements($userId) {
        // Call stored procedure to check and unlock achievements
        $stmt = $this->db->prepare("CALL CheckAndUnlockAchievements(?)");
        $stmt->execute([$userId]);
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
$coursesController = new CoursesController();
$coursesController->handleRequest();
?>