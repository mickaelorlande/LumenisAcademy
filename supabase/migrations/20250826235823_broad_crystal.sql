-- ===== LUMENIS ACADEMY - BANCO DE DADOS MYSQL =====
-- Versão simplificada para XAMPP

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS `lumenis_academy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lumenis_academy`;

-- ===== TABELA DE USUÁRIOS =====
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_premium` tinyint(1) DEFAULT 0,
  `neural_profile` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `login_attempts` int(11) DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== TABELA DE CURSOS =====
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `level` varchar(50) DEFAULT 'iniciante',
  `instructor_name` varchar(255) NOT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `is_premium` tinyint(1) DEFAULT 0,
  `duration_hours` int(11) DEFAULT 0,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_students` int(11) DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== TABELA DE MATRÍCULAS =====
CREATE TABLE IF NOT EXISTS `user_enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrollment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `progress_percentage` decimal(5,2) DEFAULT 0.00,
  `is_completed` tinyint(1) DEFAULT 0,
  `total_study_time` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_course` (`user_id`, `course_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== TABELA DE MÉTRICAS NEURAIS =====
CREATE TABLE IF NOT EXISTS `neural_metrics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `metric_type` varchar(50) NOT NULL,
  `value` decimal(5,2) NOT NULL,
  `recorded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `metric_type` (`metric_type`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== TABELA DE PAGAMENTOS =====
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT 'credit_card',
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== INSERIR DADOS DE EXEMPLO =====

-- Usuário administrador
INSERT INTO `users` (`uuid`, `email`, `password_hash`, `first_name`, `last_name`, `is_premium`, `neural_profile`) VALUES
(UUID(), 'admin@lumenis.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Lumenis', 1, '{"plasticidade": 95, "dopamina": 90, "acetilcolina": 88, "serotonina": 92}');

-- Cursos de exemplo
INSERT INTO `courses` (`uuid`, `title`, `description`, `category`, `level`, `instructor_name`, `thumbnail_url`, `price`, `is_premium`, `duration_hours`, `rating`, `total_students`) VALUES
(UUID(), 'Neurociência do Aprendizado', 'Compreenda como seu cérebro aprende e otimize seus processos cognitivos', 'featured', 'Todos os Níveis', 'Dra. Jordana Silva', 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg', 0.00, 0, 12, 4.9, 2847),
(UUID(), 'Python Completo', 'Aprenda Python do zero ao avançado com projetos práticos', 'technology', 'Todos os Níveis', 'Dr. Lucas Tech', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg', 297.00, 1, 60, 4.9, 5432),
(UUID(), 'Matemática Fundamental', 'Base sólida em matemática com metodologia neurocientífica', 'fundamental', 'Fundamental', 'Prof. Ana Santos', 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg', 0.00, 0, 20, 4.6, 3421),
(UUID(), 'Filosofia Avançada', 'Explore as principais correntes filosóficas', 'autodidata', 'Avançado', 'Prof. Sócrates Moderno', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', 497.00, 1, 45, 4.8, 1876);

COMMIT;

-- ===== ÍNDICES PARA PERFORMANCE =====
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_enrollments_user ON user_enrollments(user_id);
CREATE INDEX idx_neural_user_type ON neural_metrics(user_id, metric_type);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);