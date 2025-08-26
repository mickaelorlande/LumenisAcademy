-- ===== LUMENIS ACADEMY DATABASE SCHEMA =====
-- Advanced educational platform with neural tracking and IoT integration

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Create Database
CREATE DATABASE IF NOT EXISTS `lumenis_academy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lumenis_academy`;

-- ===== USERS TABLE =====
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `premium_expires_at` datetime DEFAULT NULL,
  `neural_profile` json DEFAULT NULL,
  `learning_preferences` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `login_attempts` int(11) DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`),
  KEY `is_active` (`is_active`),
  KEY `is_premium` (`is_premium`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== COURSES TABLE =====
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `category` enum('featured','fundamental','medio','enem','eja','technology','autodidata') NOT NULL,
  `level` enum('iniciante','intermediario','avancado','todos') DEFAULT 'iniciante',
  `instructor_id` int(11) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `trailer_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `is_premium` tinyint(1) DEFAULT 0,
  `duration_hours` int(11) DEFAULT 0,
  `total_lessons` int(11) DEFAULT 0,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_ratings` int(11) DEFAULT 0,
  `total_students` int(11) DEFAULT 0,
  `neural_tags` json DEFAULT NULL,
  `learning_objectives` json DEFAULT NULL,
  `prerequisites` json DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category` (`category`),
  KEY `level` (`level`),
  KEY `instructor_id` (`instructor_id`),
  KEY `is_premium` (`is_premium`),
  KEY `is_published` (`is_published`),
  KEY `rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== COURSE MODULES TABLE =====
CREATE TABLE `course_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `course_id` (`course_id`),
  KEY `order_index` (`order_index`),
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== LESSONS TABLE =====
CREATE TABLE `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `module_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content_type` enum('video','pdf','exercise','quiz','interactive') NOT NULL,
  `content_url` varchar(500) DEFAULT NULL,
  `content_data` json DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT 0,
  `order_index` int(11) NOT NULL DEFAULT 0,
  `neural_difficulty` int(11) DEFAULT 1,
  `cognitive_load` json DEFAULT NULL,
  `is_free` tinyint(1) DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `module_id` (`module_id`),
  KEY `content_type` (`content_type`),
  KEY `order_index` (`order_index`),
  KEY `is_free` (`is_free`),
  FOREIGN KEY (`module_id`) REFERENCES `course_modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== USER ENROLLMENTS TABLE =====
CREATE TABLE `user_enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrollment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `completion_date` datetime DEFAULT NULL,
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `last_accessed` datetime DEFAULT NULL,
  `total_study_time` int(11) DEFAULT 0,
  `neural_progress` json DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `certificate_issued` tinyint(1) DEFAULT 0,
  `certificate_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_course` (`user_id`, `course_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  KEY `is_completed` (`is_completed`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== LESSON PROGRESS TABLE =====
CREATE TABLE `lesson_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `status` enum('not_started','in_progress','completed','mastered') DEFAULT 'not_started',
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `time_spent` int(11) DEFAULT 0,
  `attempts` int(11) DEFAULT 0,
  `best_score` decimal(5,2) DEFAULT NULL,
  `neural_metrics` json DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `last_accessed` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_lesson` (`user_id`, `lesson_id`),
  KEY `user_id` (`user_id`),
  KEY `lesson_id` (`lesson_id`),
  KEY `status` (`status`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== NEURAL METRICS TABLE =====
CREATE TABLE `neural_metrics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `metric_type` enum('focus','attention','stress','engagement','dopamine','acetylcholine','serotonina') NOT NULL,
  `value` decimal(5,2) NOT NULL,
  `context` json DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `recorded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `session_id` (`session_id`),
  KEY `metric_type` (`metric_type`),
  KEY `recorded_at` (`recorded_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== IOT DEVICES TABLE =====
CREATE TABLE `iot_devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_name` varchar(255) NOT NULL,
  `device_type` enum('neurovision_ar','cognisensor','hub_quantico','wearable','sensor') NOT NULL,
  `device_model` varchar(255) DEFAULT NULL,
  `mac_address` varchar(17) DEFAULT NULL,
  `firmware_version` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_sync` datetime DEFAULT NULL,
  `battery_level` int(11) DEFAULT NULL,
  `configuration` json DEFAULT NULL,
  `calibration_data` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `mac_address` (`mac_address`),
  KEY `user_id` (`user_id`),
  KEY `device_type` (`device_type`),
  KEY `is_active` (`is_active`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== GAMIFICATION ACHIEVEMENTS TABLE =====
CREATE TABLE `achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `category` enum('learning','neural','social','completion','streak','mastery') NOT NULL,
  `points` int(11) DEFAULT 0,
  `rarity` enum('common','rare','epic','legendary','cosmic') DEFAULT 'common',
  `requirements` json NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `name` (`name`),
  KEY `category` (`category`),
  KEY `rarity` (`rarity`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== USER ACHIEVEMENTS TABLE =====
CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `progress` decimal(5,2) DEFAULT 0.00,
  `is_unlocked` tinyint(1) DEFAULT 0,
  `unlocked_at` datetime DEFAULT NULL,
  `context_data` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_achievement` (`user_id`, `achievement_id`),
  KEY `user_id` (`user_id`),
  KEY `achievement_id` (`achievement_id`),
  KEY `is_unlocked` (`is_unlocked`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== FORUM CATEGORIES TABLE =====
CREATE TABLE `forum_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `color` varchar(7) DEFAULT '#7C3AED',
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `name` (`name`),
  KEY `order_index` (`order_index`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== FORUM THREADS TABLE =====
CREATE TABLE `forum_threads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `category_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_locked` tinyint(1) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `replies_count` int(11) DEFAULT 0,
  `last_reply_at` datetime DEFAULT NULL,
  `last_reply_user_id` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`),
  KEY `is_pinned` (`is_pinned`),
  KEY `last_reply_at` (`last_reply_at`),
  FOREIGN KEY (`category_id`) REFERENCES `forum_categories` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== FORUM REPLIES TABLE =====
CREATE TABLE `forum_replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `parent_reply_id` int(11) DEFAULT NULL,
  `is_solution` tinyint(1) DEFAULT 0,
  `likes_count` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `thread_id` (`thread_id`),
  KEY `user_id` (`user_id`),
  KEY `parent_reply_id` (`parent_reply_id`),
  KEY `is_solution` (`is_solution`),
  FOREIGN KEY (`thread_id`) REFERENCES `forum_threads` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_reply_id`) REFERENCES `forum_replies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== LIBRARY RESOURCES TABLE =====
CREATE TABLE `library_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` enum('math','science','tech','humanities','philosophy','economics') NOT NULL,
  `resource_type` enum('pdf','video','article','book','research') NOT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `external_url` varchar(500) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `pages_count` int(11) DEFAULT NULL,
  `language` varchar(10) DEFAULT 'pt',
  `tags` json DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `download_count` int(11) DEFAULT 0,
  `rating` decimal(3,2) DEFAULT 0.00,
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `category` (`category`),
  KEY `resource_type` (`resource_type`),
  KEY `is_premium` (`is_premium`),
  KEY `is_published` (`is_published`),
  KEY `rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== PAYMENTS TABLE =====
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_type` enum('technology','autodidata','ultimate') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'BRL',
  `payment_method` enum('credit_card','pix','boleto') NOT NULL,
  `payment_provider` varchar(50) DEFAULT 'stripe',
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','processing','completed','failed','refunded') DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `user_id` (`user_id`),
  KEY `plan_type` (`plan_type`),
  KEY `status` (`status`),
  KEY `provider_payment_id` (`provider_payment_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== AI CONVERSATIONS TABLE =====
CREATE TABLE `ai_conversations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `message_type` enum('user','ai') NOT NULL,
  `content` text NOT NULL,
  `context` json DEFAULT NULL,
  `neural_analysis` json DEFAULT NULL,
  `response_time_ms` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `user_id` (`user_id`),
  KEY `session_id` (`session_id`),
  KEY `message_type` (`message_type`),
  KEY `created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== SYSTEM LOGS TABLE =====
CREATE TABLE `system_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` enum('DEBUG','INFO','WARNING','ERROR','CRITICAL') NOT NULL,
  `message` text NOT NULL,
  `context` json DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `level` (`level`),
  KEY `user_id` (`user_id`),
  KEY `created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== INSERT SAMPLE DATA =====

-- Sample Achievements
INSERT INTO `achievements` (`uuid`, `name`, `description`, `icon`, `category`, `points`, `rarity`, `requirements`) VALUES
(UUID(), 'Mestre Quântico', 'Completou 10 cursos avançados', 'fas fa-star', 'completion', 1000, 'epic', '{"courses_completed": 10, "min_level": "avancado"}'),
(UUID(), 'Neuroplasticidade Máxima', '95% de desenvolvimento cognitivo', 'fas fa-brain', 'neural', 1500, 'legendary', '{"neural_development": 95}'),
(UUID(), 'Explorador Cósmico', 'Explorou todas as áreas de conhecimento', 'fas fa-rocket', 'learning', 800, 'rare', '{"categories_explored": 7}'),
(UUID(), 'Mentor da Comunidade', 'Ajudou 50 estudantes no fórum', 'fas fa-users', 'social', 600, 'rare', '{"forum_helps": 50}'),
(UUID(), 'Sequência Estelar', 'Manteve sequência de 30 dias', 'fas fa-fire', 'streak', 500, 'common', '{"daily_streak": 30}');

-- Sample Forum Categories
INSERT INTO `forum_categories` (`uuid`, `name`, `description`, `icon`, `color`, `order_index`) VALUES
(UUID(), 'Neurociência e Aprendizado', 'Discussões sobre como o cérebro aprende', 'fas fa-brain', '#7C3AED', 1),
(UUID(), 'IA na Educação', 'Inteligência artificial aplicada ao ensino', 'fas fa-robot', '#DB2777', 2),
(UUID(), 'Gamificação', 'Jogos e elementos lúdicos no aprendizado', 'fas fa-gamepad', '#06B6D4', 3),
(UUID(), 'Tecnologia', 'Programação, desenvolvimento e inovação', 'fas fa-code', '#10B981', 4),
(UUID(), 'Filosofia e Humanidades', 'Discussões filosóficas e humanísticas', 'fas fa-book', '#F59E0B', 5);

-- Sample Library Resources
INSERT INTO `library_resources` (`uuid`, `title`, `author`, `description`, `category`, `resource_type`, `external_url`, `pages_count`, `tags`, `is_premium`) VALUES
(UUID(), 'Neuroplasticidade e Aprendizado', 'Dr. Norman Doidge', 'Como o cérebro se transforma através do aprendizado', 'science', 'pdf', '#', 320, '["neurociencia", "aprendizado", "cerebro"]', 0),
(UUID(), 'Inteligência Artificial Moderna', 'Stuart Russell', 'Abordagem abrangente da inteligência artificial', 'tech', 'pdf', '#', 1152, '["ia", "algoritmos", "machine-learning"]', 1),
(UUID(), 'Filosofia da Mente', 'David Chalmers', 'Explorando a consciência e a mente humana', 'humanities', 'pdf', '#', 450, '["filosofia", "consciencia", "mente"]', 1),
(UUID(), 'Matemática para IA', 'Ian Goodfellow', 'Fundamentos matemáticos para inteligência artificial', 'math', 'pdf', '#', 800, '["matematica", "ia", "algebra-linear"]', 0);

COMMIT;

-- ===== INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_users_email_active ON users(email, is_active);
CREATE INDEX idx_courses_category_published ON courses(category, is_published);
CREATE INDEX idx_enrollments_user_progress ON user_enrollments(user_id, progress_percentage);
CREATE INDEX idx_neural_metrics_user_type_date ON neural_metrics(user_id, metric_type, recorded_at);
CREATE INDEX idx_forum_threads_category_updated ON forum_threads(category_id, updated_at);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);

-- ===== VIEWS FOR COMMON QUERIES =====
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_premium,
    COUNT(DISTINCT ue.course_id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN ue.is_completed = 1 THEN ue.course_id END) as completed_courses,
    AVG(ue.progress_percentage) as avg_progress,
    SUM(ue.total_study_time) as total_study_time,
    COUNT(DISTINCT ua.achievement_id) as total_achievements
FROM users u
LEFT JOIN user_enrollments ue ON u.id = ue.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id AND ua.is_unlocked = 1
WHERE u.is_active = 1
GROUP BY u.id;

CREATE VIEW course_stats AS
SELECT 
    c.id,
    c.title,
    c.category,
    c.price,
    c.is_premium,
    COUNT(DISTINCT ue.user_id) as total_students,
    AVG(ue.progress_percentage) as avg_progress,
    COUNT(DISTINCT CASE WHEN ue.is_completed = 1 THEN ue.user_id END) as completed_students,
    c.rating,
    c.total_ratings
FROM courses c
LEFT JOIN user_enrollments ue ON c.id = ue.course_id
WHERE c.is_published = 1
GROUP BY c.id;

-- ===== STORED PROCEDURES =====
DELIMITER //

CREATE PROCEDURE UpdateUserNeuralProfile(
    IN p_user_id INT,
    IN p_metric_type VARCHAR(50),
    IN p_value DECIMAL(5,2),
    IN p_session_id VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert neural metric
    INSERT INTO neural_metrics (user_id, session_id, metric_type, value, recorded_at)
    VALUES (p_user_id, p_session_id, p_metric_type, p_value, NOW());
    
    -- Update user neural profile
    UPDATE users 
    SET neural_profile = JSON_SET(
        COALESCE(neural_profile, '{}'),
        CONCAT('$.', p_metric_type),
        p_value
    ),
    updated_at = NOW()
    WHERE id = p_user_id;
    
    COMMIT;
END //

CREATE PROCEDURE CheckAndUnlockAchievements(IN p_user_id INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE achievement_id INT;
    DECLARE achievement_requirements JSON;
    
    DECLARE achievement_cursor CURSOR FOR
        SELECT a.id, a.requirements
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = p_user_id
        WHERE a.is_active = 1 AND (ua.is_unlocked IS NULL OR ua.is_unlocked = 0);
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN achievement_cursor;
    
    achievement_loop: LOOP
        FETCH achievement_cursor INTO achievement_id, achievement_requirements;
        IF done THEN
            LEAVE achievement_loop;
        END IF;
        
        -- Check if user meets requirements (simplified logic)
        -- In real implementation, this would be more complex
        INSERT IGNORE INTO user_achievements (user_id, achievement_id, progress, is_unlocked, unlocked_at)
        VALUES (p_user_id, achievement_id, 100.00, 1, NOW());
        
    END LOOP;
    
    CLOSE achievement_cursor;
END //

DELIMITER ;

-- ===== TRIGGERS =====
DELIMITER //

CREATE TRIGGER update_course_stats AFTER INSERT ON user_enrollments
FOR EACH ROW
BEGIN
    UPDATE courses 
    SET total_students = (
        SELECT COUNT(*) FROM user_enrollments WHERE course_id = NEW.course_id
    )
    WHERE id = NEW.course_id;
END //

CREATE TRIGGER update_thread_reply_count AFTER INSERT ON forum_replies
FOR EACH ROW
BEGIN
    UPDATE forum_threads 
    SET replies_count = replies_count + 1,
        last_reply_at = NOW(),
        last_reply_user_id = NEW.user_id
    WHERE id = NEW.thread_id;
END //

DELIMITER ;

-- ===== SECURITY SETTINGS =====
-- Create application user with limited privileges
CREATE USER IF NOT EXISTS 'lumenis_app'@'localhost' IDENTIFIED BY 'secure_app_password_2025';
GRANT SELECT, INSERT, UPDATE, DELETE ON lumenis_academy.* TO 'lumenis_app'@'localhost';
GRANT EXECUTE ON lumenis_academy.* TO 'lumenis_app'@'localhost';
FLUSH PRIVILEGES;