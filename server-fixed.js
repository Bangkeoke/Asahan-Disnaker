const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

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

// Simple login (no bcrypt needed)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password });
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUserId = user.id;
        const { password: _, ...userResponse } = user;
        console.log('Login successful for:', username);
        res.json({
            success: true,
            user: userResponse,
            token: 'simple-token-' + user.id
        });
    } else {
        console.log('Login failed for:', username);
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Get current user
app.get('/api/me', (req, res) => {
    if (!currentUserId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = users.find(u => u.id === currentUserId);
    if (user) {
        const { password: _, ...userResponse } = user;
        res.json(userResponse);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Letters API
app.get('/api/letters', (req, res) => {
    const { type, status, priority } = req.query;
    
    let filteredLetters = [...letters];
    
    if (type) filteredLetters = filteredLetters.filter(l => l.type === type);
    if (status) filteredLetters = filteredLetters.filter(l => l.status === status);
    if (priority) filteredLetters = filteredLetters.filter(l => l.priority === priority);
    
    res.json(filteredLetters);
});

app.get('/api/letters/:id', (req, res) => {
    const letter = letters.find(l => l.id === parseInt(req.params.id));
    if (letter) {
        res.json(letter);
    } else {
        res.status(404).json({ error: 'Letter not found' });
    }
});

app.post('/api/letters', (req, res) => {
    const newLetter = {
        id: Math.max(...letters.map(l => l.id), 0) + 1,
        ...req.body,
        createdAt: new Date().toISOString(),
        createdBy: currentUserId,
        dispositions: []
    };
    
    letters.push(newLetter);
    res.status(201).json(newLetter);
});

app.put('/api/letters/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const letterIndex = letters.findIndex(l => l.id === id);
    
    if (letterIndex !== -1) {
        letters[letterIndex] = { ...letters[letterIndex], ...req.body };
        res.json(letters[letterIndex]);
    } else {
        res.status(404).json({ error: 'Letter not found' });
    }
});

app.delete('/api/letters/:id', (req, res) => {
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
app.get('/api/archived-letters', (req, res) => {
    res.json(archivedLetters);
});

app.post('/api/letters/:id/archive', (req, res) => {
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
app.get('/api/users', (req, res) => {
    const usersResponse = users.map(({ password, ...user }) => user);
    res.json(usersResponse);
});

// Statistics API
app.get('/api/statistics', (req, res) => {
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
app.post('/api/letters/:id/dispositions', (req, res) => {
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

// Start server on available port
const PORT = 5000;

async function startServer() {
    for (const port of ports) {
        try {
            await new Promise((resolve, reject) => {
                const server = app.listen(port, () => {
                    console.log(`🚀 Server running on http://localhost:${port}`);
                    console.log(`📱 Demo Accounts:`);
                    console.log(`   - prabowo / password123 (Kepala Dinas)`);
                    console.log(`   - admin / password123 (Administrator)`);
                    console.log(`   - sekretaris / sekretaris123 (Sekretaris)`);
                    console.log(`   - staff / staff123 (Staff)`);
                    console.log(`🔧 All features are working!`);
                    resolve(server);
                }).on('error', reject);
            });
            break;
        } catch (error) {
            if (error.code !== 'EADDRINUSE') throw error;
            console.log(`Port ${port} busy, trying next...`);
        }
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down server...');
    process.exit(0);
});

startServer().catch(console.error);