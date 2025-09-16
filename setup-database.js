const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    let connection;
    
    try {
        // Connect to MySQL server (without database)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });

        console.log('Connected to MySQL server');

        // Create database if not exists
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'sistem_surat'}`);
        console.log(`Database ${process.env.DB_NAME || 'sistem_surat'} created or already exists`);

        // Use the database
        await connection.execute(`USE ${process.env.DB_NAME || 'sistem_surat'}`);

        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                department VARCHAR(100) NOT NULL,
                role ENUM('Staff', 'Kepala Bidang', 'Sekretaris', 'Kepala Dinas', 'Administrator') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created');

        // Create letters table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS letters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type ENUM('incoming', 'outgoing') NOT NULL,
                subject VARCHAR(255) NOT NULL,
                sender VARCHAR(255) NOT NULL,
                recipient VARCHAR(255) NOT NULL,
                letter_number VARCHAR(100),
                content TEXT NOT NULL,
                priority ENUM('rendah', 'sedang', 'tinggi') DEFAULT 'sedang',
                status ENUM('draft', 'diterima', 'menunggu_persetujuan', 'disetujui', 'ditolak', 'disposisi', 'selesai', 'dikirim') DEFAULT 'draft',
                attachment LONGTEXT,
                approval_notes TEXT,
                created_by INT,
                approved_by INT,
                approved_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('Letters table created');

        // Create dispositions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS dispositions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                letter_id INT NOT NULL,
                disposition_to VARCHAR(255) NOT NULL,
                instructions TEXT NOT NULL,
                deadline DATE NOT NULL,
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('Dispositions table created');

        // Create archived_letters table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS archived_letters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                original_letter_id INT NOT NULL,
                type ENUM('incoming', 'outgoing') NOT NULL,
                subject VARCHAR(255) NOT NULL,
                sender VARCHAR(255) NOT NULL,
                recipient VARCHAR(255) NOT NULL,
                letter_number VARCHAR(100),
                content TEXT NOT NULL,
                priority ENUM('rendah', 'sedang', 'tinggi') DEFAULT 'sedang',
                status VARCHAR(50) DEFAULT 'archived',
                attachment LONGTEXT,
                approval_notes TEXT,
                created_by INT,
                approved_by INT,
                archived_by INT,
                approved_at TIMESTAMP NULL,
                original_created_at TIMESTAMP NOT NULL,
                archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (archived_by) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('Archived letters table created');

        // Insert default users
        const bcrypt = require('bcryptjs');
        
        const defaultUsers = [
            {
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
                full_name: 'Administrator',
                email: 'admin@dinastenagakerja.asahan.go.id',
                department: 'Sekretariat',
                role: 'Kepala Dinas'
            },
            {
                username: 'prabowo',
                password: await bcrypt.hash('prabowo123', 10),
                full_name: 'Prabowo Subianto',
                email: 'prabowo@dinastenagakerja.asahan.go.id',
                department: 'Bidang Penempatan dan Perluasan Kerja',
                role: 'Kepala Bidang'
            },
            {
                username: 'sekretaris',
                password: await bcrypt.hash('sekretaris123', 10),
                full_name: 'Siti Nurhaliza',
                email: 'sekretaris@dinastenagakerja.asahan.go.id',
                department: 'Sekretariat',
                role: 'Sekretaris'
            },
            {
                username: 'staff',
                password: await bcrypt.hash('staff123', 10),
                full_name: 'Ahmad Rizki',
                email: 'staff@dinastenagakerja.asahan.go.id',
                department: 'Bidang Penempatan dan Perluasan Kerja',
                role: 'Staff'
            }
        ];

        for (const user of defaultUsers) {
            try {
                await connection.execute(`
                    INSERT INTO users (username, password, full_name, email, department, role)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [user.username, user.password, user.full_name, user.email, user.department, user.role]);
            } catch (error) {
                if (error.code !== 'ER_DUP_ENTRY') {
                    console.error(`Error inserting user ${user.username}:`, error.message);
                }
            }
        }
        console.log('Default users inserted');

        // Insert sample letters
        const sampleLetters = [
            {
                type: 'outgoing',
                subject: 'Disposisi Sekretaris - Koordinasi Lintas Bidang untuk Optimalisasi Pelayanan',
                sender: 'Dinas Ketenagakerjaan Kabupaten Asahan',
                recipient: 'Bidang Penempatan dan Perluasan Kerja, Bidang Hubungan Industrial dan Persyaratan Kerja',
                content: 'Dalam rangka meningkatkan kualitas pelayanan kepada masyarakat, diperlukan koordinasi yang baik antar bidang.',
                priority: 'tinggi',
                status: 'disetujui',
                created_by: 2,
                approved_by: 1
            },
            {
                type: 'incoming',
                subject: 'Permohonan Data Ketenagakerjaan Tahun 2025',
                sender: 'Badan Pusat Statistik Kabupaten Asahan',
                recipient: 'Dinas Ketenagakerjaan Kabupaten Asahan',
                letter_number: '001/BPS-ASAHAN/2025',
                content: 'Dalam rangka penyusunan data statistik ketenagakerjaan tahun 2025, kami memohon bantuan untuk menyediakan data terkini.',
                priority: 'sedang',
                status: 'diterima',
                created_by: 1
            }
        ];

        for (const letter of sampleLetters) {
            try {
                await connection.execute(`
                    INSERT INTO letters (type, subject, sender, recipient, letter_number, content, priority, status, created_by, approved_by)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [letter.type, letter.subject, letter.sender, letter.recipient, letter.letter_number || null, 
                    letter.content, letter.priority, letter.status, letter.created_by, letter.approved_by || null]);
            } catch (error) {
                console.error('Error inserting sample letter:', error.message);
            }
        }
        console.log('Sample letters inserted');

        console.log('\n✅ Database setup completed successfully!');
        console.log('🚀 You can now run: npm start');

    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();