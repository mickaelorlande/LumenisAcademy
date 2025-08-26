<?php
require_once 'config.php';

header('Content-Type: application/json');

class NeuralController {
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
                    if (end($pathParts) === 'metrics') {
                        $this->recordMetrics();
                    } elseif (end($pathParts) === 'analysis') {
                        $this->analyzeProgress();
                    } elseif (end($pathParts) === 'recommendations') {
                        $this->getRecommendations();
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Endpoint not found']);
                    }
                    break;
                    
                case 'GET':
                    if (end($pathParts) === 'dashboard') {
                        $this->getDashboardData();
                    } elseif (end($pathParts) === 'profile') {
                        $this->getNeuralProfile();
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
            logMessage('ERROR', 'Neural API error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
    
    private function recordMetrics() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['metrics']) || !is_array($input['metrics'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Metrics array required']);
            return;
        }
        
        $sessionId = $input['sessionId'] ?? uniqid('session_', true);
        $deviceId = sanitizeInput($input['deviceId'] ?? 'web_browser');
        $context = $input['context'] ?? [];
        
        $recordedMetrics = [];
        
        foreach ($input['metrics'] as $metric) {
            if (!isset($metric['type']) || !isset($metric['value'])) {
                continue;
            }
            
            $type = sanitizeInput($metric['type']);
            $value = max(0, min(100, (float)$metric['value']));
            
            // Validate metric type
            $validTypes = ['focus', 'attention', 'stress', 'engagement', 'dopamine', 'acetylcholine', 'serotonina'];
            if (!in_array($type, $validTypes)) {
                continue;
            }
            
            $stmt = $this->db->prepare("
                INSERT INTO neural_metrics (user_id, session_id, metric_type, value, context, device_id, recorded_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $stmt->execute([
                $user['user_id'],
                $sessionId,
                $type,
                $value,
                json_encode($context),
                $deviceId
            ]);
            
            $recordedMetrics[] = [
                'type' => $type,
                'value' => $value,
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }
        
        // Update user neural profile
        $this->updateNeuralProfile($user['user_id'], $input['metrics']);
        
        // Generate AI insights
        $insights = $this->generateNeuralInsights($user['user_id'], $recordedMetrics);
        
        echo json_encode([
            'success' => true,
            'message' => 'Neural metrics recorded successfully',
            'recordedMetrics' => $recordedMetrics,
            'insights' => $insights
        ]);
    }
    
    private function updateNeuralProfile($userId, $metrics) {
        // Calculate moving averages for neural profile
        $stmt = $this->db->prepare("
            SELECT metric_type, AVG(value) as avg_value
            FROM neural_metrics
            WHERE user_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY metric_type
        ");
        $stmt->execute([$userId]);
        $averages = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        // Update user profile
        $stmt = $this->db->prepare("
            UPDATE users 
            SET neural_profile = JSON_SET(
                COALESCE(neural_profile, '{}'),
                '$.last_update', NOW(),
                '$.weekly_averages', ?,
                '$.total_sessions', COALESCE(JSON_EXTRACT(neural_profile, '$.total_sessions'), 0) + 1
            )
            WHERE id = ?
        ");
        $stmt->execute([json_encode($averages), $userId]);
    }
    
    private function generateNeuralInsights($userId, $metrics) {
        $insights = [];
        
        foreach ($metrics as $metric) {
            $type = $metric['type'];
            $value = $metric['value'];
            
            switch ($type) {
                case 'dopamine':
                    if ($value > 80) {
                        $insights[] = [
                            'type' => 'positive',
                            'message' => 'Excelente! Seus níveis de dopamina indicam alta motivação. Continue assim!',
                            'recommendation' => 'Aproveite este momento para abordar conteúdos mais desafiadores.'
                        ];
                    } elseif ($value < 40) {
                        $insights[] = [
                            'type' => 'suggestion',
                            'message' => 'Níveis de motivação baixos detectados.',
                            'recommendation' => 'Que tal fazer uma pausa ou tentar uma atividade gamificada?'
                        ];
                    }
                    break;
                    
                case 'acetylcholine':
                    if ($value > 85) {
                        $insights[] = [
                            'type' => 'positive',
                            'message' => 'Foco excepcional! Seu cérebro está em estado ótimo para aprendizado.',
                            'recommendation' => 'Momento ideal para conteúdos que exigem alta concentração.'
                        ];
                    }
                    break;
                    
                case 'stress':
                    if ($value > 70) {
                        $insights[] = [
                            'type' => 'warning',
                            'message' => 'Níveis de estresse elevados detectados.',
                            'recommendation' => 'Recomendo uma pausa com exercícios de respiração ou meditação.'
                        ];
                    }
                    break;
            }
        }
        
        return $insights;
    }
    
    private function getDashboardData() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        // Get neural profile
        $stmt = $this->db->prepare("
            SELECT neural_profile, learning_preferences, is_premium
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$user['user_id']]);
        $userProfile = $stmt->fetch();
        
        // Get recent neural metrics
        $stmt = $this->db->prepare("
            SELECT metric_type, value, recorded_at
            FROM neural_metrics
            WHERE user_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ORDER BY recorded_at DESC
            LIMIT 100
        ");
        $stmt->execute([$user['user_id']]);
        $recentMetrics = $stmt->fetchAll();
        
        // Get achievements
        $stmt = $this->db->prepare("
            SELECT 
                a.name, a.description, a.icon, a.category, a.rarity,
                ua.is_unlocked, ua.progress, ua.unlocked_at
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            WHERE a.is_active = 1
            ORDER BY ua.is_unlocked DESC, a.rarity DESC, ua.progress DESC
        ");
        $stmt->execute([$user['user_id']]);
        $achievements = $stmt->fetchAll();
        
        // Get IoT devices
        $stmt = $this->db->prepare("
            SELECT device_name, device_type, is_active, last_sync, battery_level
            FROM iot_devices
            WHERE user_id = ? AND is_active = 1
        ");
        $stmt->execute([$user['user_id']]);
        $iotDevices = $stmt->fetchAll();
        
        // Process metrics for charts
        $chartData = $this->processMetricsForChart($recentMetrics);
        
        echo json_encode([
            'success' => true,
            'dashboard' => [
                'neuralProfile' => json_decode($userProfile['neural_profile'], true),
                'learningPreferences' => json_decode($userProfile['learning_preferences'], true),
                'isPremium' => (bool)$userProfile['is_premium'],
                'recentMetrics' => $recentMetrics,
                'chartData' => $chartData,
                'achievements' => $achievements,
                'iotDevices' => $iotDevices,
                'insights' => $this->generateDashboardInsights($user['user_id'])
            ]
        ]);
    }
    
    private function processMetricsForChart($metrics) {
        $chartData = [
            'labels' => [],
            'datasets' => [
                'plasticidade' => [],
                'dopamina' => [],
                'acetilcolina' => [],
                'serotonina' => []
            ]
        ];
        
        // Group metrics by day
        $dailyMetrics = [];
        foreach ($metrics as $metric) {
            $date = date('Y-m-d', strtotime($metric['recorded_at']));
            if (!isset($dailyMetrics[$date])) {
                $dailyMetrics[$date] = [];
            }
            $dailyMetrics[$date][$metric['metric_type']] = $metric['value'];
        }
        
        // Generate chart data for last 30 days
        for ($i = 29; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $chartData['labels'][] = date('d/m', strtotime($date));
            
            foreach ($chartData['datasets'] as $metric => &$data) {
                $data[] = $dailyMetrics[$date][$metric] ?? null;
            }
        }
        
        return $chartData;
    }
    
    private function generateDashboardInsights($userId) {
        // Get user's learning patterns
        $stmt = $this->db->prepare("
            SELECT 
                AVG(CASE WHEN metric_type = 'focus' THEN value END) as avg_focus,
                AVG(CASE WHEN metric_type = 'engagement' THEN value END) as avg_engagement,
                AVG(CASE WHEN metric_type = 'stress' THEN value END) as avg_stress,
                COUNT(DISTINCT DATE(recorded_at)) as active_days
            FROM neural_metrics
            WHERE user_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ");
        $stmt->execute([$userId]);
        $patterns = $stmt->fetch();
        
        $insights = [];
        
        if ($patterns['avg_focus'] > 80) {
            $insights[] = [
                'type' => 'achievement',
                'title' => 'Foco Excepcional',
                'message' => 'Seus níveis de foco estão 23% acima da média! Continue assim!',
                'icon' => 'fas fa-bullseye'
            ];
        }
        
        if ($patterns['active_days'] >= 20) {
            $insights[] = [
                'type' => 'streak',
                'title' => 'Consistência Cósmica',
                'message' => "Você esteve ativo por {$patterns['active_days']} dias este mês!",
                'icon' => 'fas fa-fire'
            ];
        }
        
        if ($patterns['avg_stress'] > 70) {
            $insights[] = [
                'type' => 'warning',
                'title' => 'Níveis de Estresse Elevados',
                'message' => 'Considere fazer pausas mais frequentes ou atividades relaxantes.',
                'icon' => 'fas fa-heart'
            ];
        }
        
        return $insights;
    }
    
    private function getRecommendations() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        // Get user's neural profile and learning history
        $stmt = $this->db->prepare("
            SELECT neural_profile, learning_preferences
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$user['user_id']]);
        $profile = $stmt->fetch();
        
        // Get recent performance
        $stmt = $this->db->prepare("
            SELECT 
                AVG(CASE WHEN metric_type = 'focus' THEN value END) as focus,
                AVG(CASE WHEN metric_type = 'engagement' THEN value END) as engagement,
                AVG(CASE WHEN metric_type = 'dopamine' THEN value END) as motivation
            FROM neural_metrics
            WHERE user_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ");
        $stmt->execute([$user['user_id']]);
        $recentPerformance = $stmt->fetch();
        
        // Generate AI-powered recommendations
        $recommendations = $this->generateAIRecommendations($profile, $recentPerformance);
        
        echo json_encode([
            'success' => true,
            'recommendations' => $recommendations
        ]);
    }
    
    private function generateAIRecommendations($profile, $performance) {
        $neuralProfile = json_decode($profile['neural_profile'], true);
        $learningPrefs = json_decode($profile['learning_preferences'], true);
        
        $recommendations = [];
        
        // Focus-based recommendations
        if ($performance['focus'] < 60) {
            $recommendations[] = [
                'type' => 'technique',
                'title' => 'Técnica Pomodoro Neural',
                'description' => 'Baseado em seus padrões de atenção, recomendo sessões de 25 minutos com pausas de 5 minutos.',
                'priority' => 'high',
                'category' => 'focus'
            ];
        }
        
        // Motivation-based recommendations
        if ($performance['motivation'] < 50) {
            $recommendations[] = [
                'type' => 'gamification',
                'title' => 'Ativação de Dopamina',
                'description' => 'Seus níveis de motivação podem ser aumentados com desafios gamificados e recompensas imediatas.',
                'priority' => 'medium',
                'category' => 'motivation'
            ];
        }
        
        // Learning style recommendations
        $learningStyle = $learningPrefs['learning_style'] ?? 'visual';
        
        if ($learningStyle === 'visual') {
            $recommendations[] = [
                'type' => 'content',
                'title' => 'Conteúdo Visual Otimizado',
                'description' => 'Baseado em seu perfil visual, recomendo cursos com diagramas, infográficos e simulações.',
                'priority' => 'medium',
                'category' => 'content'
            ];
        }
        
        // Adaptive difficulty
        $avgPerformance = ($performance['focus'] + $performance['engagement'] + $performance['motivation']) / 3;
        
        if ($avgPerformance > 80) {
            $recommendations[] = [
                'type' => 'challenge',
                'title' => 'Desafio Avançado Disponível',
                'description' => 'Seu desempenho excepcional indica que você está pronto para conteúdos mais complexos!',
                'priority' => 'high',
                'category' => 'difficulty'
            ];
        }
        
        return $recommendations;
    }
    
    private function analyzeProgress() {
        $user = $this->authenticateUser();
        if (!$user) return;
        
        // Comprehensive neural analysis
        $stmt = $this->db->prepare("
            SELECT 
                metric_type,
                AVG(value) as avg_value,
                MIN(value) as min_value,
                MAX(value) as max_value,
                STDDEV(value) as std_deviation,
                COUNT(*) as data_points
            FROM neural_metrics
            WHERE user_id = ? AND recorded_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY metric_type
        ");
        $stmt->execute([$user['user_id']]);
        $analysis = $stmt->fetchAll();
        
        // Learning velocity analysis
        $stmt = $this->db->prepare("
            SELECT 
                DATE(lp.last_accessed) as date,
                COUNT(*) as lessons_accessed,
                AVG(lp.progress_percentage) as avg_progress,
                SUM(lp.time_spent) as total_time
            FROM lesson_progress lp
            WHERE lp.user_id = ? AND lp.last_accessed >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(lp.last_accessed)
            ORDER BY date
        ");
        $stmt->execute([$user['user_id']]);
        $learningVelocity = $stmt->fetchAll();
        
        // Cognitive load analysis
        $cognitiveLoad = $this->analyzeCognitiveLoad($user['user_id']);
        
        // Neuroplasticity index
        $neuroplasticityIndex = $this->calculateNeuroplasticityIndex($analysis);
        
        echo json_encode([
            'success' => true,
            'analysis' => [
                'neuralMetrics' => $analysis,
                'learningVelocity' => $learningVelocity,
                'cognitiveLoad' => $cognitiveLoad,
                'neuroplasticityIndex' => $neuroplasticityIndex,
                'recommendations' => $this->generateAdvancedRecommendations($analysis, $learningVelocity)
            ]
        ]);
    }
    
    private function analyzeCognitiveLoad($userId) {
        $stmt = $this->db->prepare("
            SELECT 
                l.neural_difficulty,
                AVG(lp.progress_percentage) as avg_progress,
                AVG(lp.time_spent) as avg_time,
                COUNT(*) as attempts
            FROM lesson_progress lp
            JOIN lessons l ON lp.lesson_id = l.id
            WHERE lp.user_id = ? AND lp.last_accessed >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY l.neural_difficulty
        ");
        $stmt->execute([$userId]);
        $cognitiveData = $stmt->fetchAll();
        
        $optimalDifficulty = 5; // Default
        $maxEfficiency = 0;
        
        foreach ($cognitiveData as $data) {
            $efficiency = $data['avg_progress'] / max($data['avg_time'], 1);
            if ($efficiency > $maxEfficiency) {
                $maxEfficiency = $efficiency;
                $optimalDifficulty = $data['neural_difficulty'];
            }
        }
        
        return [
            'optimalDifficulty' => $optimalDifficulty,
            'currentEfficiency' => $maxEfficiency,
            'difficultyData' => $cognitiveData
        ];
    }
    
    private function calculateNeuroplasticityIndex($metrics) {
        $weights = [
            'focus' => 0.25,
            'engagement' => 0.25,
            'dopamine' => 0.20,
            'acetylcholine' => 0.15,
            'serotonina' => 0.15
        ];
        
        $weightedSum = 0;
        $totalWeight = 0;
        
        foreach ($metrics as $metric) {
            $type = $metric['metric_type'];
            if (isset($weights[$type])) {
                $weightedSum += $metric['avg_value'] * $weights[$type];
                $totalWeight += $weights[$type];
            }
        }
        
        $index = $totalWeight > 0 ? $weightedSum / $totalWeight : 50;
        
        return [
            'value' => round($index, 2),
            'level' => $this->getNeuroplasticityLevel($index),
            'interpretation' => $this->interpretNeuroplasticityIndex($index)
        ];
    }
    
    private function getNeuroplasticityLevel($index) {
        if ($index >= 90) return 'Cósmico';
        if ($index >= 80) return 'Excepcional';
        if ($index >= 70) return 'Avançado';
        if ($index >= 60) return 'Bom';
        if ($index >= 50) return 'Médio';
        return 'Em Desenvolvimento';
    }
    
    private function interpretNeuroplasticityIndex($index) {
        if ($index >= 90) {
            return 'Seu cérebro está operando em níveis cósmicos! Você possui uma capacidade extraordinária de formar novas conexões neurais.';
        } elseif ($index >= 80) {
            return 'Excelente neuroplasticidade! Seu cérebro se adapta rapidamente a novos desafios e informações.';
        } elseif ($index >= 70) {
            return 'Boa capacidade de adaptação neural. Continue praticando para alcançar níveis ainda mais elevados.';
        } elseif ($index >= 60) {
            return 'Neuroplasticidade em desenvolvimento. Foque em atividades que desafiem diferentes áreas do cérebro.';
        } else {
            return 'Há muito potencial para crescimento! Recomendo atividades variadas e desafiadoras para estimular a plasticidade.';
        }
    }
    
    private function generateAdvancedRecommendations($metrics, $velocity) {
        $recommendations = [];
        
        // Analyze learning patterns
        $focusMetric = array_filter($metrics, fn($m) => $m['metric_type'] === 'focus')[0] ?? null;
        $engagementMetric = array_filter($metrics, fn($m) => $m['metric_type'] === 'engagement')[0] ?? null;
        
        if ($focusMetric && $focusMetric['std_deviation'] > 20) {
            $recommendations[] = [
                'type' => 'pattern',
                'title' => 'Padrão de Foco Irregular',
                'description' => 'Detectamos variações significativas em seu foco. Recomendamos horários fixos de estudo.',
                'action' => 'schedule_optimization'
            ];
        }
        
        if ($engagementMetric && $engagementMetric['avg_value'] < 60) {
            $recommendations[] = [
                'type' => 'engagement',
                'title' => 'Baixo Engajamento Detectado',
                'description' => 'Seus níveis de engajamento podem ser melhorados com conteúdo mais interativo.',
                'action' => 'content_personalization'
            ];
        }
        
        return $recommendations;
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
$neuralController = new NeuralController();
$neuralController->handleRequest();
?>