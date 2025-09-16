const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();

// Find available port
const findAvailablePort = async (startPort = 3000) => {
    const net = require('net');
    
    const isPortAvailable = (port) => {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.close(() => resolve(true));
            });
            server.on('error', () => resolve(false));
        });
    };
    
    let port = startPort;
    while (!(await isPortAvailable(port))) {
        port++;
        if (port > 3010) {
            throw new Error('No available ports found');
        }
    }
    return port;
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'surat_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

// Initialize database connection
async function initializeDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('✅ Database connection pool created');
        
        // Test connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Database connection tested successfully');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('📝 Creating database and tables...');
        
        try {
            // Create database if it doesn't exist
            const tempPool = mysql.createPool({
                ...dbConfig,
                database: undefined
            });
            
            const tempConnection = await tempPool.getConnection();
            await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
            tempConnection.release();
            await tempPool.end();
            
            // Now connect to the created database
            pool = mysql.createPool(dbConfig);
            
            // Create tables
            await createTables();
            await insertSampleData();
            
            console.log('✅ Database and tables created successfully');
            
        } catch (setupError) {
            console.error('❌ Database setup failed:', setupError.message);
            process.exit(1);
        }
    }
}

// Create tables
async function createTables() {
    const connection = await pool.getConnection();
    
    try {
        // Users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                fullName VARCHAR(100) NOT NULL,
                role ENUM('Kepala Dinas', 'Sekretaris', 'Kepala Bidang', 'Staff', 'Administrator') NOT NULL,
                department VARCHAR(100) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Letters table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS letters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type ENUM('incoming', 'outgoing') NOT NULL,
                subject VARCHAR(255) NOT NULL,
                sender VARCHAR(255),
                recipient VARCHAR(255),
                letterNumber VARCHAR(50),
                priority ENUM('tinggi', 'sedang', 'rendah') DEFAULT 'sedang',
                status ENUM('draft', 'diterima', 'menunggu_persetujuan', 'disetujui', 'ditolak', 'disposisi', 'selesai', 'dikirim') NOT NULL,
                content TEXT NOT NULL,
                attachment LONGTEXT,
                approvalNotes TEXT,
                approvedAt TIMESTAMP NULL,
                approvedBy INT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (approvedBy) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // Dispositions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS dispositions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                letterId INT NOT NULL,
                dispositionTo VARCHAR(255) NOT NULL,
                instructions TEXT NOT NULL,
                deadline DATE NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                createdBy INT,
                FOREIGN KEY (letterId) REFERENCES letters(id) ON DELETE CASCADE,
                FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // Archived letters table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS archived_letters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                originalId INT NOT NULL,
                type ENUM('incoming', 'outgoing') NOT NULL,
                subject VARCHAR(255) NOT NULL,
                sender VARCHAR(255),
                recipient VARCHAR(255),
                letterNumber VARCHAR(50),
                priority ENUM('tinggi', 'sedang', 'rendah') DEFAULT 'sedang',
                status VARCHAR(50) NOT NULL,
                content TEXT NOT NULL,
                attachment LONGTEXT,
                dispositions JSON,
                createdAt TIMESTAMP NOT NULL,
                archivedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                archivedBy INT,
                FOREIGN KEY (archivedBy) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        console.log('✅ All tables created successfully');
        
    } finally {
        connection.release();
    }
}

// Insert sample data
async function insertSampleData() {
    const connection = await pool.getConnection();
    
    try {
        // Check if users already exist
        const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
        if (existingUsers[0].count > 0) {
            console.log('📝 Sample data already exists, skipping...');
            return;
        }

        // Sample users
        const users = [
            {
                username: 'prabowo',
                email: 'prabowo@dinaskerja.asahan.go.id',
                password: await bcrypt.hash('password123', 10),
                fullName: 'Prabowo Subianto',
                role: 'Kepala Dinas',
                department: 'Kepala Dinas'
            },
            {
                username: 'sekretaris',
                email: 'sekretaris@dinaskerja.asahan.go.id',
                password: await bcrypt.hash('password123', 10),
                fullName: 'Siti Nurhaliza',
                role: 'Sekretaris',
                department: 'Sekretariat'
            },
            {
                username: 'kabid1',
                email: 'kabid1@dinaskerja.asahan.go.id',
                password: await bcrypt.hash('password123', 10),
                fullName: 'Ahmad Dahlan',
                role: 'Kepala Bidang',
                department: 'Bidang Penempatan dan Perluasan Kerja'
            },
            {
                username: 'staff1',
                email: 'staff1@dinaskerja.asahan.go.id',
                password: await bcrypt.hash('password123', 10),
                fullName: 'Rina Susanti',
                role: 'Staff',
                department: 'Bidang Hubungan Industrial'
            }
        ];

        for (const user of users) {
            await connection.execute(
                'INSERT INTO users (username, email, password, fullName, role, department) VALUES (?, ?, ?, ?, ?, ?)',
                [user.username, user.email, user.password, user.fullName, user.role, user.department]
            );
        }

        // Sample letter
        await connection.execute(`
            INSERT INTO letters (type, subject, sender, recipient, priority, status, content) VALUES 
            ('outgoing', 'Undangan Rapat Koordinasi', 'Dinas Ketenagakerjaan Kabupaten Asahan', 'Seluruh Kepala Bidang', 'tinggi', 'draft', 'Dengan hormat, kami mengundang Bapak/Ibu untuk menghadiri rapat koordinasi yang akan dilaksanakan pada hari Senin, 15 Januari 2024.')
        `);

        console.log('✅ Sample data inserted successfully');
        
    } finally {
        connection.release();
    }
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, username, email, fullName, role, department, createdAt FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]);

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Letters routes
app.get('/api/letters', authenticateToken, async (req, res) => {
    try {
        const { type, status, priority } = req.query;
        
        let query = 'SELECT * FROM letters WHERE 1=1';
        const params = [];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }

        query += ' ORDER BY createdAt DESC';

        const [letters] = await pool.execute(query, params);

        // Get dispositions for each letter
        for (let letter of letters) {
            const [dispositions] = await pool.execute(
                'SELECT * FROM dispositions WHERE letterId = ? ORDER BY createdAt DESC',
                [letter.id]
            );
            letter.dispositions = dispositions;
        }

        res.json(letters);

    } catch (error) {
        console.error('Get letters error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single letter
app.get('/api/letters/:id', authenticateToken, async (req, res) => {
    try {
        const [letters] = await pool.execute(
            'SELECT * FROM letters WHERE id = ?',
            [req.params.id]
        );

        if (letters.length === 0) {
            return res.status(404).json({ error: 'Letter not found' });
        }

        const letter = letters[0];

        // Get dispositions
        const [dispositions] = await pool.execute(
            'SELECT * FROM dispositions WHERE letterId = ? ORDER BY createdAt DESC',
            [letter.id]
        );
        letter.dispositions = dispositions;

        res.json(letter);

    } catch (error) {
        console.error('Get letter error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create letter
app.post('/api/letters', authenticateToken, async (req, res) => {
    try {
        const {
            type,
            subject,
            sender,
            recipient,
            letterNumber,
            priority = 'sedang',
            status,
            content,
            attachment
        } = req.body;

        if (!type || !subject || !content) {
            return res.status(400).json({ error: 'Type, subject, and content are required' });
        }

        const [result] = await pool.execute(`
            INSERT INTO letters (type, subject, sender, recipient, letterNumber, priority, status, content, attachment)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [type, subject, sender, recipient, letterNumber, priority, status, content, attachment]);

        const [newLetter] = await pool.execute(
            'SELECT * FROM letters WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newLetter[0]);

    } catch (error) {
        console.error('Create letter error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update letter
app.put('/api/letters/:id', authenticateToken, async (req, res) => {
    try {
        const letterId = req.params.id;
        const updates = req.body;

        // Build dynamic update query
        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(letterId);

        await pool.execute(
            `UPDATE letters SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        const [updatedLetter] = await pool.execute(
            'SELECT * FROM letters WHERE id = ?',
            [letterId]
        );

        if (updatedLetter.length === 0) {
            return res.status(404).json({ error: 'Letter not found' });
        }

        res.json(updatedLetter[0]);

    } catch (error) {
        console.error('Update letter error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete letter
app.delete('/api/letters/:id', authenticateToken, async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM letters WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Letter not found' });
        }

        res.json({ message: 'Letter deleted successfully' });

    } catch (error) {
        console.error('Delete letter error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Archive letter
app.post('/api/letters/:id/archive', authenticateToken, async (req, res) => {
    try {
        const letterId = req.params.id;

        // Get letter with dispositions
        const [letters] = await pool.execute(
            'SELECT * FROM letters WHERE id = ?',
            [letterId]
        );

        if (letters.length === 0) {
            return res.status(404).json({ error: 'Letter not found' });
        }

        const letter = letters[0];

        // Get dispositions
        const [dispositions] = await pool.execute(
            'SELECT * FROM dispositions WHERE letterId = ?',
            [letterId]
        );

        // Insert into archived_letters
        await pool.execute(`
            INSERT INTO archived_letters 
            (originalId, type, subject, sender, recipient, letterNumber, priority, status, content, attachment, dispositions, createdAt, archivedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            letter.id,
            letter.type,
            letter.subject,
            letter.sender,
            letter.recipient,
            letter.letterNumber,
            letter.priority,
            letter.status,
            letter.content,
            letter.attachment,
            JSON.stringify(dispositions),
            letter.createdAt,
            req.user.id
        ]);

        // Delete from letters and dispositions
        await pool.execute('DELETE FROM letters WHERE id = ?', [letterId]);

        res.json({ message: 'Letter archived successfully' });

    } catch (error) {
        console.error('Archive letter error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get archived letters
app.get('/api/archived-letters', authenticateToken, async (req, res) => {
    try {
        const [archivedLetters] = await pool.execute(
            'SELECT * FROM archived_letters ORDER BY archivedAt DESC'
        );

        // Parse dispositions JSON
        const letters = archivedLetters.map(letter => ({
            ...letter,
            dispositions: letter.dispositions ? JSON.parse(letter.dispositions) : []
        }));

        res.json(letters);

    } catch (error) {
        console.error('Get archived letters error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Restore from archive
app.post('/api/archived-letters/:id/restore', authenticateToken, async (req, res) => {
    try {
        const archiveId = req.params.id;

        const [archivedLetters] = await pool.execute(
            'SELECT * FROM archived_letters WHERE id = ?',
            [archiveId]
        );

        if (archivedLetters.length === 0) {
            return res.status(404).json({ error: 'Archived letter not found' });
        }

        const archived = archivedLetters[0];

        // Insert back to letters
        const [result] = await pool.execute(`
            INSERT INTO letters (type, subject, sender, recipient, letterNumber, priority, status, content, attachment, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            archived.type,
            archived.subject,
            archived.sender,
            archived.recipient,
            archived.letterNumber,
            archived.priority,
            archived.status,
            archived.content,
            archived.attachment,
            archived.createdAt
        ]);

        const newLetterId = result.insertId;

        // Restore dispositions if any
        if (archived.dispositions) {
            const dispositions = JSON.parse(archived.dispositions);
            for (const disp of dispositions) {
                await pool.execute(`
                    INSERT INTO dispositions (letterId, dispositionTo, instructions, deadline, createdAt, createdBy)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [newLetterId, disp.dispositionTo, disp.instructions, disp.deadline, disp.createdAt, disp.createdBy]);
            }
        }

        // Delete from archive
        await pool.execute('DELETE FROM archived_letters WHERE id = ?', [archiveId]);

        res.json({ message: 'Letter restored successfully' });

    } catch (error) {
        console.error('Restore letter error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete from archive permanently
app.delete('/api/archived-letters/:id', authenticateToken, async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM archived_letters WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Archived letter not found' });
        }

        res.json({ message: 'Letter permanently deleted from archive' });

    } catch (error) {
        console.error('Delete archived letter error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Dispositions routes
app.post('/api/dispositions', authenticateToken, async (req, res) => {
    try {
        const { letterId, dispositionTo, instructions, deadline } = req.body;

        if (!letterId || !dispositionTo || !instructions || !deadline) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await pool.execute(`
            INSERT INTO dispositions (letterId, dispositionTo, instructions, deadline, createdBy)
            VALUES (?, ?, ?, ?, ?)
        `, [letterId, dispositionTo, instructions, deadline, req.user.id]);

        // Update letter status to 'disposisi'
        await pool.execute(
            'UPDATE letters SET status = ? WHERE id = ?',
            ['disposisi', letterId]
        );

        res.status(201).json({ message: 'Disposition created successfully' });

    } catch (error) {
        console.error('Create disposition error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Users routes
app.get('/api/users', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, username, email, fullName, role, department, createdAt FROM users ORDER BY createdAt DESC'
        );

        res.json(users);

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete user
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user is trying to delete themselves
        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const [result] = await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Statistics
app.get('/api/statistics', authenticateToken, async (req, res) => {
    try {
        const [letterStats] = await pool.execute(`
            SELECT 
                COUNT(*) as totalLetters,
                SUM(CASE WHEN type = 'incoming' THEN 1 ELSE 0 END) as incomingLetters,
                SUM(CASE WHEN type = 'outgoing' THEN 1 ELSE 0 END) as outgoingLetters,
                SUM(CASE WHEN status IN ('draft', 'diterima', 'menunggu_persetujuan') THEN 1 ELSE 0 END) as pendingLetters,
                SUM(CASE WHEN MONTH(createdAt) = MONTH(CURRENT_DATE()) AND YEAR(createdAt) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) as thisMonthLetters,
                SUM(CASE WHEN type = 'incoming' AND MONTH(createdAt) = MONTH(CURRENT_DATE()) AND YEAR(createdAt) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) as thisMonthIncoming,
                SUM(CASE WHEN type = 'outgoing' AND MONTH(createdAt) = MONTH(CURRENT_DATE()) AND YEAR(createdAt) = YEAR(CURRENT_DATE()) THEN 1 ELSE 0 END) as thisMonthOutgoing
            FROM letters
        `);

        const [archivedStats] = await pool.execute(`
            SELECT COUNT(*) as archivedLetters FROM archived_letters
        `);

        const stats = {
            ...letterStats[0],
            archivedLetters: archivedStats[0].archivedLetters
        };

        res.json(stats);

    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search letters
app.get('/api/letters/search', authenticateToken, async (req, res) => {
    try {
        const { q, type, status, priority } = req.query;

        let query = 'SELECT * FROM letters WHERE 1=1';
        const params = [];

        if (q) {
            query += ' AND (subject LIKE ? OR sender LIKE ? OR recipient LIKE ? OR content LIKE ?)';
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }

        query += ' ORDER BY createdAt DESC';

        const [letters] = await pool.execute(query, params);

        res.json(letters);

    } catch (error) {
        console.error('Search letters error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    if (pool) {
        await pool.end();
    }
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    if (pool) {
        await pool.end();
    }
    process.exit(0);
});

// Start server
async function startServer() {
    try {
        await initializeDatabase();
        
        const PORT = await findAvailablePort(3000);
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📝 Access the application at: http://localhost:${PORT}`);
            console.log(`🔐 Demo accounts:`);
            console.log(`   - Username: prabowo, Password: password123 (Kepala Dinas)`);
            console.log(`   - Username: sekretaris, Password: password123 (Sekretaris)`);
            console.log(`   - Username: kabid1, Password: password123 (Kepala Bidang)`);
            console.log(`   - Username: staff1, Password: password123 (Staff)`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();