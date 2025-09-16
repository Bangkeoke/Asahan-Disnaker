// Database simulation using localStorage
class LocalDatabase {
    constructor() {
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Initialize default data if not exists
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    fullName: 'Administrator',
                    email: 'admin@dinastenagakerja.asahan.go.id',
                    department: 'Sekretariat',
                    role: 'Kepala Dinas',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    username: 'prabowo',
                    password: 'prabowo123',
                    fullName: 'Prabowo Subianto',
                    email: 'prabowo@dinastenagakerja.asahan.go.id',
                    department: 'Bidang Penempatan dan Perluasan Kerja',
                    role: 'Kepala Bidang',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    username: 'sekretaris',
                    password: 'sekretaris123',
                    fullName: 'Siti Nurhaliza',
                    email: 'sekretaris@dinastenagakerja.asahan.go.id',
                    department: 'Sekretariat',
                    role: 'Sekretaris',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    username: 'staff',
                    password: 'staff123',
                    fullName: 'Ahmad Rizki',
                    email: 'staff@dinastenagakerja.asahan.go.id',
                    department: 'Bidang Penempatan dan Perluasan Kerja',
                    role: 'Staff',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('letters')) {
            const defaultLetters = [
                {
                    id: 1,
                    type: 'outgoing',
                    subject: 'Disposisi Sekretaris - Koordinasi Lintas Bidang untuk Optimalisasi Pelayanan',
                    recipient: 'Bidang Penempatan dan Perluasan Kerja, Bidang Hubungan Industrial dan Persyaratan Kerja, Bidang Pelatihan dan Produktivitas Tenaga Kerja',
                    sender: 'Dinas Ketenagakerjaan Kabupaten Asahan',
                    content: 'Dalam rangka meningkatkan kualitas pelayanan kepada masyarakat, diperlukan koordinasi yang baik antar bidang. Mohon untuk melakukan evaluasi dan perbaikan sistem pelayanan yang ada.',
                    priority: 'tinggi',
                    status: 'disetujui',
                    createdAt: '2025-09-08T10:00:00Z',
                    createdBy: 2,
                    approvedAt: '2025-09-08T14:30:00Z',
                    approvedBy: 1,
                    attachment: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbnRvaCBTdXJhdCBLZWx1YXI8L3RleHQ+Cjwvc3ZnPgo='
                },
                {
                    id: 2,
                    type: 'incoming',
                    subject: 'Permohonan Data Ketenagakerjaan Tahun 2025',
                    sender: 'Badan Pusat Statistik Kabupaten Asahan',
                    recipient: 'Dinas Ketenagakerjaan Kabupaten Asahan',
                    letterNumber: '001/BPS-ASAHAN/2025',
                    content: 'Dengan hormat, dalam rangka penyusunan data statistik ketenagakerjaan tahun 2025, kami memohon bantuan untuk menyediakan data terkini mengenai angka pengangguran, tenaga kerja yang terserap, dan program-program ketenagakerjaan yang telah dilaksanakan.',
                    priority: 'sedang',
                    status: 'diterima',
                    createdAt: '2025-09-07T09:15:00Z',
                    createdBy: 1,
                    attachment: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U4ZjVlOCIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM0Yjc0NGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbnRvaCBTdXJhdCBNYXN1azwvdGV4dD4KPC9zdmc+Cg=='
                },
                {
                    id: 3,
                    type: 'incoming',
                    subject: 'Undangan Rapat Koordinasi Daerah Bidang Ketenagakerjaan',
                    sender: 'Dinas Ketenagakerjaan Provinsi Sumatera Utara',
                    recipient: 'Kepala Dinas Ketenagakerjaan Kabupaten Asahan',
                    letterNumber: 'UD-002/DISNAKER-SUMUT/2025',
                    content: 'Mengundang Bapak/Ibu untuk menghadiri Rapat Koordinasi Daerah Bidang Ketenagakerjaan yang akan dilaksanakan pada tanggal 15 September 2025 di Kantor Gubernur Sumatera Utara. Agenda rapat meliputi evaluasi program ketenagakerjaan dan perencanaan tahun 2026.',
                    priority: 'tinggi',
                    status: 'disetujui',
                    createdAt: '2025-09-06T14:20:00Z',
                    createdBy: 1,
                    approvedAt: '2025-09-06T16:00:00Z',
                    approvedBy: 3,
                    dispositions: [
                        {
                            to: 'Bidang Penempatan dan Perluasan Kerja',
                            instructions: 'Mohon siapkan data dan laporan terkait program penempatan kerja untuk dibawa dalam rapat koordinasi.',
                            deadline: '2025-09-14',
                            createdAt: '2025-09-06T16:30:00Z',
                            createdBy: 3
                        }
                    ]
                },
                {
                    id: 4,
                    type: 'incoming',
                    subject: 'Laporan Pelaksanaan Job Fair Kabupaten Asahan',
                    sender: 'PT. Mandiri Career Center',
                    recipient: 'Bidang Penempatan dan Perluasan Kerja',
                    letterNumber: 'LPR-003/MCC/2025',
                    content: 'Melaporkan hasil pelaksanaan Job Fair Kabupaten Asahan yang telah dilaksanakan pada tanggal 1-3 September 2025. Total peserta yang hadir sebanyak 1.250 orang dengan 45 perusahaan yang berpartisipasi. Dari kegiatan tersebut, tercatat 320 orang mendapat kesempatan kerja.',
                    priority: 'sedang',
                    status: 'disposisi',
                    createdAt: '2025-09-05T11:30:00Z',
                    createdBy: 2,
                    approvedAt: '2025-09-05T14:00:00Z',
                    approvedBy: 1,
                    dispositions: [
                        {
                            to: 'Bidang Penempatan dan Perluasan Kerja',
                            instructions: 'Mohon tindak lanjuti laporan ini dan buat evaluasi untuk perbaikan job fair selanjutnya.',
                            deadline: '2025-09-12',
                            createdAt: '2025-09-05T14:15:00Z',
                            createdBy: 1
                        }
                    ]
                },
                {
                    id: 5,
                    type: 'incoming',
                    subject: 'Pengajuan Izin Operasional Lembaga Pelatihan Kerja',
                    sender: 'LPK Mandiri Skill Center',
                    recipient: 'Bidang Pelatihan dan Produktivitas Tenaga Kerja',
                    letterNumber: 'PRM-004/MSC/2025',
                    content: 'Dengan hormat, kami mengajukan permohonan izin operasional untuk Lembaga Pelatihan Kerja (LPK) Mandiri Skill Center yang berlokasi di Jl. Merdeka No. 123 Kisaran. LPK ini akan menyelenggarakan pelatihan di bidang teknologi informasi, otomotif, dan tata boga.',
                    priority: 'sedang',
                    status: 'diterima',
                    createdAt: '2025-09-04T08:45:00Z',
                    createdBy: 1
                }
            ];
            localStorage.setItem('letters', JSON.stringify(defaultLetters));
        }

        // Initialize archived letters if not exists
        if (!localStorage.getItem('archivedLetters')) {
            const defaultArchivedLetters = [
                {
                    id: 100,
                    type: 'outgoing',
                    subject: 'Laporan Tahunan Ketenagakerjaan 2024',
                    recipient: 'Bupati Kabupaten Asahan',
                    sender: 'Dinas Ketenagakerjaan Kabupaten Asahan',
                    content: 'Dengan hormat, kami sampaikan laporan tahunan ketenagakerjaan Kabupaten Asahan tahun 2024 yang mencakup data statistik, program yang telah dilaksanakan, dan pencapaian target.',
                    priority: 'tinggi',
                    status: 'archived',
                    createdAt: '2024-12-28T10:00:00Z',
                    createdBy: 1,
                    archivedAt: '2025-01-15T14:30:00Z',
                    archivedBy: 1
                }
            ];
            localStorage.setItem('archivedLetters', JSON.stringify(defaultArchivedLetters));
        }

        if (!localStorage.getItem('currentUser')) {
            // No user logged in initially
        }
    }

    // User management
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    updateUser(id, userData) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            localStorage.setItem('users', JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        return true;
    }

    // Authentication
    login(username, password) {
        const user = this.getUserByUsername(username);
        if (user && user.password === password) {
            const sessionUser = { ...user };
            delete sessionUser.password; // Don't store password in session
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            return sessionUser;
        }
        return null;
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Letter management
    getLetters(type = null) {
        const letters = JSON.parse(localStorage.getItem('letters') || '[]');
        if (type) {
            return letters.filter(letter => letter.type === type);
        }
        return letters;
    }

    getLetterById(id) {
        const letters = this.getLetters();
        return letters.find(letter => letter.id === id);
    }

    createLetter(letterData) {
        const letters = this.getLetters();
        const currentUser = this.getCurrentUser();
        const newLetter = {
            id: letters.length > 0 ? Math.max(...letters.map(l => l.id)) + 1 : 1,
            ...letterData,
            createdAt: new Date().toISOString(),
            createdBy: currentUser ? currentUser.id : null,
            status: letterData.status || 'draft'
        };
        letters.push(newLetter);
        localStorage.setItem('letters', JSON.stringify(letters));
        return newLetter;
    }

    updateLetter(id, letterData) {
        const letters = this.getLetters();
        const index = letters.findIndex(letter => letter.id === id);
        if (index !== -1) {
            letters[index] = { ...letters[index], ...letterData };
            localStorage.setItem('letters', JSON.stringify(letters));
            return letters[index];
        }
        return null;
    }

    deleteLetter(id) {
        const letters = this.getLetters();
        const filteredLetters = letters.filter(letter => letter.id !== id);
        localStorage.setItem('letters', JSON.stringify(filteredLetters));
        return true;
    }

    // Archive management
    getArchivedLetters() {
        return JSON.parse(localStorage.getItem('archivedLetters') || '[]');
    }

    getArchivedLetterById(id) {
        const archivedLetters = this.getArchivedLetters();
        return archivedLetters.find(letter => letter.id === id);
    }

    archiveLetter(id) {
        const letters = this.getLetters();
        const letterIndex = letters.findIndex(letter => letter.id === id);
        
        if (letterIndex !== -1) {
            const letter = letters[letterIndex];
            const currentUser = this.getCurrentUser();
            
            // Add archive metadata
            const archivedLetter = {
                ...letter,
                status: 'archived',
                archivedAt: new Date().toISOString(),
                archivedBy: currentUser ? currentUser.id : null
            };
            
            // Move to archived letters
            const archivedLetters = this.getArchivedLetters();
            archivedLetters.push(archivedLetter);
            localStorage.setItem('archivedLetters', JSON.stringify(archivedLetters));
            
            // Remove from active letters
            letters.splice(letterIndex, 1);
            localStorage.setItem('letters', JSON.stringify(letters));
            
            return true;
        }
        return false;
    }

    restoreFromArchive(id) {
        const archivedLetters = this.getArchivedLetters();
        const letterIndex = archivedLetters.findIndex(letter => letter.id === id);
        
        if (letterIndex !== -1) {
            const letter = archivedLetters[letterIndex];
            
            // Remove archive metadata and restore original status
            const restoredLetter = { ...letter };
            delete restoredLetter.archivedAt;
            delete restoredLetter.archivedBy;
            restoredLetter.status = letter.dispositions && letter.dispositions.length > 0 ? 'disposisi' : 'disetujui';
            
            // Move back to active letters
            const letters = this.getLetters();
            letters.push(restoredLetter);
            localStorage.setItem('letters', JSON.stringify(letters));
            
            // Remove from archived letters
            archivedLetters.splice(letterIndex, 1);
            localStorage.setItem('archivedLetters', JSON.stringify(archivedLetters));
            
            return true;
        }
        return false;
    }

    deleteFromArchive(id) {
        const archivedLetters = this.getArchivedLetters();
        const filteredLetters = archivedLetters.filter(letter => letter.id !== id);
        localStorage.setItem('archivedLetters', JSON.stringify(filteredLetters));
        return true;
    }

    searchArchivedLetters(query, type = null, year = null) {
        let letters = this.getArchivedLetters();
        
        if (type) {
            letters = letters.filter(letter => letter.type === type);
        }
        
        if (year) {
            letters = letters.filter(letter => {
                const letterYear = new Date(letter.createdAt).getFullYear();
                return letterYear.toString() === year;
            });
        }
        
        if (query) {
            query = query.toLowerCase();
            letters = letters.filter(letter => 
                letter.subject.toLowerCase().includes(query) ||
                letter.recipient.toLowerCase().includes(query) ||
                letter.sender.toLowerCase().includes(query) ||
                (letter.letterNumber && letter.letterNumber.toLowerCase().includes(query)) ||
                letter.content.toLowerCase().includes(query)
            );
        }
        
        return letters;
    }

    // Search and filter
    searchLetters(query, type = null, status = null, priority = null) {
        let letters = this.getLetters(type);
        
        if (query) {
            query = query.toLowerCase();
            letters = letters.filter(letter => 
                letter.subject.toLowerCase().includes(query) ||
                letter.recipient.toLowerCase().includes(query) ||
                letter.sender.toLowerCase().includes(query) ||
                (letter.letterNumber && letter.letterNumber.toLowerCase().includes(query))
            );
        }
        
        if (status) {
            letters = letters.filter(letter => letter.status === status);
        }
        
        if (priority) {
            letters = letters.filter(letter => letter.priority === priority);
        }
        
        return letters;
    }

    // Statistics
    getStatistics() {
        const letters = this.getLetters();
        const archivedLetters = this.getArchivedLetters();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const thisMonthLetters = letters.filter(letter => {
            const letterDate = new Date(letter.createdAt);
            return letterDate.getMonth() === currentMonth && letterDate.getFullYear() === currentYear;
        });
        
        return {
            totalLetters: letters.length,
            incomingLetters: letters.filter(l => l.type === 'incoming').length,
            outgoingLetters: letters.filter(l => l.type === 'outgoing').length,
            pendingLetters: letters.filter(l => l.status === 'pending' || l.status === 'draft' || l.status === 'diterima' || l.status === 'menunggu_persetujuan').length,
            thisMonthIncoming: thisMonthLetters.filter(l => l.type === 'incoming').length,
            thisMonthOutgoing: thisMonthLetters.filter(l => l.type === 'outgoing').length,
            archivedLetters: archivedLetters.length
        };
    }

    // Export data for backup
    exportData() {
        return {
            users: this.getUsers(),
            letters: this.getLetters(),
            archivedLetters: this.getArchivedLetters(),
            exportDate: new Date().toISOString()
        };
    }

    // Import data from backup
    importData(data) {
        if (data.users) {
            localStorage.setItem('users', JSON.stringify(data.users));
        }
        if (data.letters) {
            localStorage.setItem('letters', JSON.stringify(data.letters));
        }
        if (data.archivedLetters) {
            localStorage.setItem('archivedLetters', JSON.stringify(data.archivedLetters));
        }
    }

    // Clear all data
    clearAllData() {
        localStorage.removeItem('users');
        localStorage.removeItem('letters');
        localStorage.removeItem('archivedLetters');
        localStorage.removeItem('currentUser');
        this.initializeDatabase();
    }
}

// Initialize database
const db = new LocalDatabase();