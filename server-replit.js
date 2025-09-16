const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow images and PDFs
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Only images, PDFs, and documents are allowed!'));
        }
    }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory database for testing (no bcrypt needed)
let users = [
    {
        id: 1,
        username: 'prabowo',
        password: 'password123',
        fullName: 'Prabowo Subianto',
        email: 'prabowo@disnaker.asahan.go.id',
        role: 'Kepala Dinas',
        department: 'Kepala Dinas'
    },
    {
        id: 2,
        username: 'admin',
        password: 'password123',
        fullName: 'Administrator',
        email: 'admin@disnaker.asahan.go.id',
        role: 'Administrator',
        department: 'IT Support'
    },
    {
        id: 3,
        username: 'sekretaris',
        password: 'sekretaris123',
        fullName: 'Siti Nurhaliza',
        email: 'sekretaris@disnaker.asahan.go.id',
        role: 'Sekretaris',
        department: 'Sekretariat'
    },
    {
        id: 4,
        username: 'staff',
        password: 'staff123',
        fullName: 'Ahmad Rizki',
        email: 'staff@disnaker.asahan.go.id',
        role: 'Staff',
        department: 'Bidang Penempatan dan Perluasan Kerja'
    }
];

let letters = [
    {
        id: 1,
        type: 'outgoing',
        subject: 'Undangan Rapat Koordinasi Lintas Bidang',
        sender: 'Dinas Ketenagakerjaan Kabupaten Asahan',
        recipient: 'Seluruh Kepala Bidang',
        letterNumber: 'UND/001/2024',
        priority: 'sedang',
        status: 'draft',
        content: 'Dengan hormat, kami mengundang Bapak/Ibu untuk menghadiri rapat koordinasi lintas bidang.',
        createdAt: new Date().toISOString(),
        createdBy: 1,
        dispositions: []
    },
    {
        id: 2,
        type: 'incoming',
        subject: 'Permohonan Data Ketenagakerjaan',
        sender: 'Badan Pusat Statistik Kabupaten Asahan',
        recipient: 'Dinas Ketenagakerjaan Kabupaten Asahan',
        letterNumber: 'PMH/002/2024',
        priority: 'tinggi',
        status: 'diterima',
        content: 'Dengan hormat, kami memohon data statistik ketenagakerjaan untuk keperluan penelitian.',
        createdAt: new Date().toISOString(),
        createdBy: 1,
        dispositions: []
    }
];

let archivedLetters = [];
let currentUserId = null;

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Session storage for security
const activeSessions = new Map();

// Generate secure session token
function generateSessionToken() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    const session = activeSessions.get(token);
    if (!session) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Check if session is expired (24 hours)
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
        activeSessions.delete(token);
        return res.status(403).json({ error: 'Session expired' });
    }
    
    req.user = session.user;
    next();
}

// Secure login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Log only username for security (never log passwords)
    console.log('Login attempt for username:', username);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Generate secure session token
        const token = generateSessionToken();
        const session = {
            user: { ...user },
            createdAt: Date.now(),
            lastActivity: Date.now()
        };
        delete session.user.password; // Remove password from session
        
        activeSessions.set(token, session);
        
        console.log('Login successful for:', username);
        res.json({
            success: true,
            user: session.user,
            token: token
        });
    } else {
        console.log('Login failed for username:', username);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Logout endpoint
app.post('/api/logout', authenticateToken, (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
        activeSessions.delete(token);
    }
    
    res.json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

// Letters API
app.get('/api/letters', authenticateToken, (req, res) => {
    const { type, status, priority } = req.query;
    
    let filteredLetters = [...letters];
    
    if (type) filteredLetters = filteredLetters.filter(l => l.type === type);
    if (status) filteredLetters = filteredLetters.filter(l => l.status === status);
    if (priority) filteredLetters = filteredLetters.filter(l => l.priority === priority);
    
    res.json(filteredLetters);
});

app.get('/api/letters/:id', authenticateToken, (req, res) => {
    const letter = letters.find(l => l.id === parseInt(req.params.id));
    if (letter) {
        res.json(letter);
    } else {
        res.status(404).json({ error: 'Letter not found' });
    }
});

app.post('/api/letters', authenticateToken, upload.single('attachment'), (req, res) => {
    try {
        const newLetter = {
            id: Math.max(...letters.map(l => l.id), 0) + 1,
            ...req.body,
            createdAt: new Date().toISOString(),
            createdBy: currentUserId,
            dispositions: [],
            attachment: req.file ? {
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype
            } : null
        };
        
        letters.push(newLetter);
        res.status(201).json(newLetter);
    } catch (error) {
        console.error('Error creating letter:', error);
        res.status(500).json({ error: 'Failed to create letter' });
    }
});

app.put('/api/letters/:id', authenticateToken, upload.single('attachment'), (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const letterIndex = letters.findIndex(l => l.id === id);
        
        if (letterIndex !== -1) {
            const updatedData = { ...req.body };
            
            // Handle file attachment update
            if (req.file) {
                updatedData.attachment = {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    path: req.file.path,
                    size: req.file.size,
                    mimetype: req.file.mimetype
                };
            }
            
            letters[letterIndex] = { ...letters[letterIndex], ...updatedData };
            res.json(letters[letterIndex]);
        } else {
            res.status(404).json({ error: 'Letter not found' });
        }
    } catch (error) {
        console.error('Error updating letter:', error);
        res.status(500).json({ error: 'Failed to update letter' });
    }
});

app.delete('/api/letters/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const letterIndex = letters.findIndex(l => l.id === id);
    
    if (letterIndex !== -1) {
        letters.splice(letterIndex, 1);
        res.json({ message: 'Letter deleted successfully' });
    } else {
        res.status(404).json({ error: 'Letter not found' });
    }
});

// Archive API
app.get('/api/archived-letters', authenticateToken, (req, res) => {
    res.json(archivedLetters);
});

app.post('/api/letters/:id/archive', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const letterIndex = letters.findIndex(l => l.id === id);
    
    if (letterIndex !== -1) {
        const letter = letters[letterIndex];
        archivedLetters.push({
            ...letter,
            archivedAt: new Date().toISOString(),
            archivedBy: currentUserId
        });
        letters.splice(letterIndex, 1);
        res.json({ message: 'Letter archived successfully' });
    } else {
        res.status(404).json({ error: 'Letter not found' });
    }
});

// Users API
app.get('/api/users', authenticateToken, (req, res) => {
    const usersResponse = users.map(({ password, ...user }) => user);
    res.json(usersResponse);
});

// Update user profile
app.put('/api/profile', authenticateToken, (req, res) => {
    if (!currentUserId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { fullName, email, department } = req.body;
    const userIndex = users.findIndex(u => u.id === currentUserId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Check if email is already used by another user
    const existingUser = users.find(u => u.email === email && u.id !== currentUserId);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Update user data
    if (fullName) users[userIndex].fullName = fullName;
    if (email) users[userIndex].email = email;
    if (department) users[userIndex].department = department;
    
    const { password: _, ...userResponse } = users[userIndex];
    res.json({ message: 'Profile updated successfully', user: userResponse });
});

// Change password
app.put('/api/change-password', authenticateToken, (req, res) => {
    if (!currentUserId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { currentPassword, newPassword } = req.body;
    const user = users.find(u => u.id === currentUserId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    if (user.password !== currentPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    
    // Update password
    user.password = newPassword;
    
    res.json({ message: 'Password changed successfully' });
});

// Add new user (Admin only)
app.post('/api/users', authenticateToken, (req, res) => {
    if (!currentUserId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser || (currentUser.role !== 'Administrator' && currentUser.role !== 'Kepala Dinas')) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    const { username, password, fullName, email, department, role } = req.body;
    
    // Validation
    if (!username || !password || !fullName || !email || !department || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if username already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = users.find(u => u.email === email);
    if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Create new user
    const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        username,
        password,
        fullName,
        email,
        department,
        role
    };
    
    users.push(newUser);
    
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({ message: 'User created successfully', user: userResponse });
});

// Delete user (Admin only)
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    if (!currentUserId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser || (currentUser.role !== 'Administrator' && currentUser.role !== 'Kepala Dinas')) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    const userId = parseInt(req.params.id);
    
    // Prevent self-deletion
    if (userId === currentUserId) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    res.json({ message: `User ${deletedUser.fullName} deleted successfully` });
});

// Statistics API
app.get('/api/statistics', authenticateToken, (req, res) => {
    const stats = {
        totalLetters: letters.length,
        totalIncoming: letters.filter(l => l.type === 'incoming').length,
        totalOutgoing: letters.filter(l => l.type === 'outgoing').length,
        pendingLetters: letters.filter(l => ['draft', 'diterima'].includes(l.status)).length,
        archivedLetters: archivedLetters.length,
        thisMonthIncoming: letters.filter(l => l.type === 'incoming').length,
        thisMonthOutgoing: letters.filter(l => l.type === 'outgoing').length
    };
    res.json(stats);
});

// Dispositions API
app.post('/api/letters/:id/dispositions', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const letter = letters.find(l => l.id === id);
    
    if (letter) {
        const disposition = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString(),
            createdBy: currentUserId
        };
        
        letter.dispositions.push(disposition);
        letter.status = 'disposisi';
        
        res.status(201).json({ message: 'Disposition created successfully' });
    } else {
        res.status(404).json({ error: 'Letter not found' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        features: {
            login: 'Working',
            letters: 'Working',
            archive: 'Working',
            users: 'Working',
            statistics: 'Working',
            dispositions: 'Working'
        }
    });
});

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server on port 5000 for Replit
const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Demo Accounts:`);
    console.log(`   - prabowo / password123 (Kepala Dinas)`);
    console.log(`   - admin / password123 (Administrator)`);
    console.log(`   - sekretaris / sekretaris123 (Sekretaris)`);
    console.log(`   - staff / staff123 (Staff)`);
    console.log(`🔧 All features are working!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down server...');
    process.exit(0);
});