-- Database Schema for Sistem Pengelolaan Surat Dinas Ketenagakerjaan Kabupaten Asahan
-- This SQL file can be used to create the database structure for server implementation

-- Create database
CREATE DATABASE IF NOT EXISTS surat_dinas_asahan;
USE surat_dinas_asahan;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    role ENUM('Staff', 'Kepala Bidang', 'Sekretaris', 'Kepala Dinas') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Letters table
CREATE TABLE letters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    letter_number VARCHAR(50) UNIQUE,
    type ENUM('incoming', 'outgoing') NOT NULL,
    subject TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    sender VARCHAR(255) NOT NULL,
    recipient TEXT NOT NULL,
    priority ENUM('rendah', 'sedang', 'tinggi') DEFAULT 'sedang',
    status ENUM('draft', 'pending', 'disetujui', 'ditolak', 'dikirim', 'diterima', 'archived') DEFAULT 'draft',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    received_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Letter attachments table
CREATE TABLE letter_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    letter_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE
);

-- Letter workflow/approval table
CREATE TABLE letter_workflow (
    id INT PRIMARY KEY AUTO_INCREMENT,
    letter_id INT NOT NULL,
    user_id INT NOT NULL,
    action ENUM('created', 'reviewed', 'approved', 'rejected', 'sent', 'received') NOT NULL,
    comments TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_user_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Letter categories table
CREATE TABLE letter_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Letter templates table
CREATE TABLE letter_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    subject_template TEXT,
    content_template LONGTEXT NOT NULL,
    category_id INT NULL,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES letter_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by INT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Activity logs table
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    related_letter_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_letter_id) REFERENCES letters(id) ON DELETE CASCADE
);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('Sekretariat', 'Sekretariat Dinas Ketenagakerjaan'),
('Bidang Penempatan dan Perluasan Kerja', 'Bidang yang menangani penempatan dan perluasan kesempatan kerja'),
('Bidang Hubungan Industrial dan Persyaratan Kerja', 'Bidang yang menangani hubungan industrial dan persyaratan kerja'),
('Bidang Pelatihan dan Produktivitas Tenaga Kerja', 'Bidang yang menangani pelatihan dan produktivitas tenaga kerja');

-- Insert default letter categories
INSERT INTO letter_categories (name, description) VALUES
('Surat Edaran', 'Surat edaran untuk pemberitahuan umum'),
('Surat Undangan', 'Surat undangan rapat atau acara'),
('Surat Tugas', 'Surat penugasan pegawai'),
('Surat Keterangan', 'Surat keterangan berbagai keperluan'),
('Surat Permohonan', 'Surat permohonan dari pihak eksternal'),
('Disposisi', 'Surat disposisi dari atasan'),
('Laporan', 'Surat laporan kegiatan atau hasil kerja');

-- Insert default admin user
INSERT INTO users (username, password, full_name, email, department, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@dinastenagakerja.asahan.go.id', 'Sekretariat', 'Kepala Dinas');

-- Insert sample user
INSERT INTO users (username, password, full_name, email, department, role) VALUES
('prabowo', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Prabowo Subianto', 'prabowo@dinastenagakerja.asahan.go.id', 'Bidang Penempatan dan Perluasan Kerja', 'Kepala Bidang');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('app_name', 'Sistem Pengelolaan Surat Dinas Ketenagakerjaan Kabupaten Asahan', 'Nama aplikasi'),
('app_version', '1.0.0', 'Versi aplikasi'),
('office_name', 'Dinas Ketenagakerjaan Kabupaten Asahan', 'Nama instansi'),
('office_address', 'Jl. Jenderal Sudirman No. 123, Kisaran, Kabupaten Asahan, Sumatera Utara', 'Alamat instansi'),
('office_phone', '(0623) 123456', 'Nomor telepon instansi'),
('office_email', 'info@dinastenagakerja.asahan.go.id', 'Email instansi'),
('letter_number_format', 'DK-{type}-{number}/{month}/{year}', 'Format nomor surat'),
('max_file_size', '10485760', 'Maksimal ukuran file upload (bytes)'),
('allowed_file_types', 'pdf,doc,docx,jpg,jpeg,png', 'Tipe file yang diizinkan');

-- Insert sample letter
INSERT INTO letters (letter_number, type, subject, content, sender, recipient, priority, status, created_by) VALUES
('DK-OUT-001/09/2025', 'outgoing', 'Disposisi Sekretaris - Koordinasi Lintas Bidang untuk Optimalisasi Pelayanan', 
'Dalam rangka meningkatkan kualitas pelayanan kepada masyarakat, diperlukan koordinasi yang baik antar bidang. Mohon untuk melakukan evaluasi dan perbaikan sistem pelayanan yang ada.', 
'Dinas Ketenagakerjaan Kabupaten Asahan', 
'Bidang Penempatan dan Perluasan Kerja, Bidang Hubungan Industrial dan Persyaratan Kerja, Bidang Pelatihan dan Produktivitas Tenaga Kerja', 
'tinggi', 'disetujui', 2);

-- Create indexes for better performance
CREATE INDEX idx_letters_type ON letters(type);
CREATE INDEX idx_letters_status ON letters(status);
CREATE INDEX idx_letters_created_by ON letters(created_by);
CREATE INDEX idx_letters_created_at ON letters(created_at);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_letter_workflow_letter_id ON letter_workflow(letter_id);
CREATE INDEX idx_letter_workflow_user_id ON letter_workflow(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Create views for common queries
CREATE VIEW v_letter_details AS
SELECT 
    l.*,
    u_creator.full_name as creator_name,
    u_creator.department as creator_department,
    u_approver.full_name as approver_name,
    u_approver.department as approver_department
FROM letters l
LEFT JOIN users u_creator ON l.created_by = u_creator.id
LEFT JOIN users u_approver ON l.approved_by = u_approver.id;

CREATE VIEW v_user_statistics AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.department,
    u.role,
    COUNT(l.id) as total_letters,
    COUNT(CASE WHEN l.type = 'incoming' THEN 1 END) as incoming_letters,
    COUNT(CASE WHEN l.type = 'outgoing' THEN 1 END) as outgoing_letters,
    COUNT(CASE WHEN l.status = 'pending' THEN 1 END) as pending_letters
FROM users u
LEFT JOIN letters l ON u.id = l.created_by
GROUP BY u.id;

-- Create stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetLettersByUser(IN user_id INT, IN letter_type VARCHAR(10))
BEGIN
    SELECT * FROM v_letter_details 
    WHERE created_by = user_id 
    AND (letter_type IS NULL OR type = letter_type)
    ORDER BY created_at DESC;
END //

CREATE PROCEDURE GetPendingApprovals(IN approver_id INT)
BEGIN
    SELECT * FROM v_letter_details 
    WHERE status = 'pending' 
    AND created_by != approver_id
    ORDER BY priority DESC, created_at ASC;
END //

CREATE PROCEDURE CreateLetterWorkflow(IN letter_id INT, IN user_id INT, IN action VARCHAR(20), IN comments TEXT)
BEGIN
    INSERT INTO letter_workflow (letter_id, user_id, action, comments) 
    VALUES (letter_id, user_id, action, comments);
    
    -- Update letter status based on action
    IF action = 'approved' THEN
        UPDATE letters SET status = 'disetujui', approved_by = user_id, approved_at = NOW() WHERE id = letter_id;
    ELSEIF action = 'rejected' THEN
        UPDATE letters SET status = 'ditolak' WHERE id = letter_id;
    ELSEIF action = 'sent' THEN
        UPDATE letters SET status = 'dikirim', sent_at = NOW() WHERE id = letter_id;
    END IF;
END //

DELIMITER ;

-- Create triggers for audit logging
DELIMITER //

CREATE TRIGGER tr_letters_insert AFTER INSERT ON letters
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_id, action, description) 
    VALUES (NEW.created_by, 'CREATE_LETTER', CONCAT('Created letter: ', NEW.subject));
END //

CREATE TRIGGER tr_letters_update AFTER UPDATE ON letters
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO activity_logs (user_id, action, description) 
        VALUES (NEW.created_by, 'UPDATE_LETTER_STATUS', CONCAT('Changed letter status from ', OLD.status, ' to ', NEW.status, ' for: ', NEW.subject));
    END IF;
END //

CREATE TRIGGER tr_users_insert AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_id, action, description) 
    VALUES (NEW.id, 'USER_REGISTERED', CONCAT('New user registered: ', NEW.full_name));
END //

DELIMITER ;

-- Grant permissions (adjust as needed for your setup)
-- CREATE USER 'surat_app'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON surat_dinas_asahan.* TO 'surat_app'@'localhost';
-- FLUSH PRIVILEGES;

-- Sample data for testing
INSERT INTO letters (letter_number, type, subject, content, sender, recipient, priority, status, created_by) VALUES
('DK-IN-001/09/2025', 'incoming', 'Permohonan Informasi Data Ketenagakerjaan', 'Dengan hormat, kami dari PT. ABC memohon informasi terkait data ketenagakerjaan di wilayah Kabupaten Asahan untuk keperluan penelitian.', 'PT. ABC', 'Dinas Ketenagakerjaan Kabupaten Asahan', 'sedang', 'pending', 1),
('DK-OUT-002/09/2025', 'outgoing', 'Undangan Rapat Koordinasi Bulanan', 'Dalam rangka koordinasi rutin bulanan, kami mengundang seluruh kepala bidang untuk menghadiri rapat koordinasi.', 'Dinas Ketenagakerjaan Kabupaten Asahan', 'Seluruh Kepala Bidang', 'tinggi', 'dikirim', 1),
('DK-OUT-003/09/2025', 'outgoing', 'Surat Tugas Pelatihan Keterampilan', 'Menugaskan pegawai untuk mengikuti pelatihan keterampilan dalam rangka peningkatan kapasitas SDM.', 'Dinas Ketenagakerjaan Kabupaten Asahan', 'Pegawai Terpilih', 'sedang', 'draft', 2);

-- Final comment
-- This database schema provides a comprehensive structure for the Document Management System
-- It includes user management, letter management, workflow tracking, notifications, and audit logging
-- The schema is designed to be scalable and maintainable for future enhancements