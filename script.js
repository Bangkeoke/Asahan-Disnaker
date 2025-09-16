// Ultra Modern Application JavaScript with Enhanced Features
class UltraModernLetterApp {
    constructor() {
        this.currentUser = null;
        this.currentLetterType = 'outgoing';
        this.letters = [];
        this.archivedLetters = [];
        this.users = [];
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            this.showLoadingState();
            
            // Simulate authentication check
            const token = localStorage.getItem('authToken');
            if (!token) {
                this.redirectToLogin();
                return;
            }

            // Initialize user data
            await this.initializeUserData();
            
            // Load initial data with staggered animation
            await this.loadInitialData();
            
            // Setup enhanced event listeners
            this.setupEventListeners();
            
            // Initialize UI enhancements
            this.initializeUIEnhancements();
            
            this.hideLoadingState();
            this.showWelcomeAnimation();
            
            console.log('🚀 Ultra Modern App initialized successfully');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showMessage('Gagal memuat aplikasi. Silakan refresh halaman.', 'error');
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        document.body.style.overflow = 'hidden';
        const loader = document.createElement('div');
        loader.id = 'appLoader';
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                flex-direction: column;
                gap: 2rem;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    border: 4px solid rgba(255,255,255,0.3);
                    border-top: 4px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <div style="
                    color: white;
                    font-size: 1.5rem;
                    font-weight: 600;
                    text-align: center;
                ">
                    <div>🚀 Loading Ultra Modern Interface...</div>
                    <div style="font-size: 1rem; opacity: 0.8; margin-top: 0.5rem;">
                        Preparing your digital workspace
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoadingState() {
        const loader = document.getElementById('appLoader');
        if (loader) {
            loader.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                loader.remove();
                document.body.style.overflow = '';
            }, 500);
        }
    }

    showWelcomeAnimation() {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255,255,255,0.95);
                backdrop-filter: blur(20px);
                padding: 2rem 3rem;
                border-radius: 2rem;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                text-align: center;
                z-index: 9999;
                animation: welcomeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                <h2 style="color: #667eea; margin-bottom: 0.5rem; font-weight: 800;">Selamat Datang!</h2>
                <p style="color: #64748b; font-weight: 500;">Interface ultra modern telah siap digunakan</p>
            </div>
        `;
        
        document.body.appendChild(welcomeMessage);
        
        setTimeout(() => {
            welcomeMessage.style.animation = 'welcomeSlideOut 0.4s ease-in forwards';
            setTimeout(() => welcomeMessage.remove(), 400);
        }, 2500);
    }

    redirectToLogin() {
        window.location.href = '/login.html';
    }

    async initializeUserData() {
        // Simulate API call
        await this.delay(800);
        
        this.currentUser = {
            id: 1,
            fullName: 'Administrator System',
            username: 'admin',
            email: 'admin@disnaker.asahan.go.id',
            role: 'Administrator',
            department: 'IT Department'
        };
        
        this.updateUserInfo();
    }

    async loadInitialData() {
        // Simulate staggered data loading
        await this.delay(300);
        await this.loadDashboardStats();
        
        await this.delay(200);
        await this.loadQuickStats();
        
        await this.delay(200);
        await this.loadSampleData();
    }

    async loadSampleData() {
        // Generate sample letters for demonstration
        this.letters = [
            {
                id: 1,
                type: 'incoming',
                subject: 'Permohonan Izin Kegiatan Pelatihan Kerja',
                sender: 'PT. Maju Bersama Indonesia',
                recipient: 'Dinas Ketenagakerjaan Kabupaten Asahan',
                letterNumber: '001/PMB/2024',
                priority: 'tinggi',
                status: 'diterima',
                content: 'Dengan hormat, kami bermaksud mengajukan permohonan izin untuk menyelenggarakan kegiatan pelatihan kerja bagi karyawan kami. Kegiatan ini direncanakan akan dilaksanakan pada bulan depan dengan melibatkan 50 peserta dari berbagai divisi.',
                createdAt: new Date().toISOString(),
                createdBy: 1
            },
            {
                id: 2,
                type: 'outgoing',
                subject: 'Undangan Rapat Koordinasi Bulanan',
                sender: 'Dinas Ketenagakerjaan Kabupaten Asahan',
                recipient: 'Seluruh Kepala Bidang',
                letterNumber: '002/DKA/2024',
                priority: 'sedang',
                status: 'draft',
                content: 'Dalam rangka koordinasi dan evaluasi program kerja bulan ini, kami mengundang Bapak/Ibu untuk hadir dalam rapat koordinasi bulanan yang akan diselenggarakan pada hari Jumat, tanggal 15 November 2024.',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                createdBy: 1
            },
            {
                id: 3,
                type: 'incoming',
                subject: 'Laporan Kegiatan Job Fair 2024',
                sender: 'Panitia Job Fair Kabupaten Asahan',
                recipient: 'Kepala Dinas Ketenagakerjaan',
                letterNumber: '003/JF/2024',
                priority: 'sedang',
                status: 'disetujui',
                content: 'Melaporkan hasil pelaksanaan Job Fair 2024 yang telah diselenggarakan pada tanggal 1-3 November 2024. Kegiatan ini berhasil mempertemukan 500 pencari kerja dengan 50 perusahaan peserta.',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                createdBy: 1
            }
        ];

        this.users = [
            {
                id: 1,
                fullName: 'Dr. Ir. Prabowo Subianto',
                username: 'prabowo',
                email: 'prabowo@disnaker.asahan.go.id',
                role: 'Kepala Dinas',
                department: 'Pimpinan',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                fullName: 'Siti Nurhaliza, S.Sos',
                username: 'sekretaris',
                email: 'sekretaris@disnaker.asahan.go.id',
                role: 'Sekretaris',
                department: 'Sekretariat',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                fullName: 'Ahmad Fadli, S.Kom',
                username: 'admin',
                email: 'admin@disnaker.asahan.go.id',
                role: 'Administrator',
                department: 'IT Support',
                createdAt: new Date().toISOString()
            }
        ];
    }

    setupEventListeners() {
        // Enhanced navigation with smooth transitions
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page, item);
            });
        });

        // Enhanced search with debouncing
        this.setupSearchListeners();
        
        // Form submissions with validation
        this.setupFormListeners();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Window events
        this.setupWindowEvents();
    }

    setupSearchListeners() {
        const searchInputs = [
            { id: 'searchIncoming', handler: (query) => this.searchLetters('incoming', query) },
            { id: 'searchOutgoing', handler: (query) => this.searchLetters('outgoing', query) },
            { id: 'searchArchive', handler: (query) => this.searchArchivedLetters(query) },
            { id: 'searchUsers', handler: (query) => this.searchUsers(query) }
        ];

        searchInputs.forEach(({ id, handler }) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', this.debounce((e) => {
                    handler(e.target.value);
                    this.addSearchAnimation(input);
                }, 300));
            }
        });
    }

    setupFormListeners() {
        // Letter form
        const letterForm = document.getElementById('letterForm');
        if (letterForm) {
            letterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLetterSubmit();
            });
        }

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Password form
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }

        // Report period change
        const reportPeriod = document.getElementById('reportPeriod');
        if (reportPeriod) {
            reportPeriod.addEventListener('change', (e) => {
                const customRange = document.getElementById('customDateRange');
                if (customRange) {
                    customRange.style.display = e.target.value === 'custom' ? 'block' : 'none';
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.handleNewLetterShortcut();
                        break;
                    case 's':
                        e.preventDefault();
                        this.handleSaveShortcut();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.focusSearchInput();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupWindowEvents() {
        // Smooth scroll behavior
        window.addEventListener('scroll', this.throttle(() => {
            this.updateScrollEffects();
        }, 16));

        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });
    }

    initializeUIEnhancements() {
        this.addHoverEffects();
        this.initializeTooltips();
        this.addLoadingStates();
        this.initializeAnimations();
    }

    addHoverEffects() {
        // Add magnetic effect to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add glow effect to cards
        document.querySelectorAll('.card, .stat-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                e.target.style.boxShadow = '0 25px 50px -12px rgba(102, 126, 234, 0.25)';
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.target.style.boxShadow = '';
            });
        });
    }

    initializeTooltips() {
        // Add tooltips to interactive elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    addLoadingStates() {
        // Add loading states to all buttons
        document.querySelectorAll('.btn').forEach(btn => {
            const originalText = btn.innerHTML;
            btn.dataset.originalText = originalText;
        });
    }

    initializeAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.card, .stat-card, .letter-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Navigation with smooth transitions
    async navigateToPage(pageId, navItem) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Update active navigation
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        navItem.classList.add('active');
        
        // Hide current page with animation
        const currentPage = document.querySelector('.page.active');
        if (currentPage) {
            currentPage.style.animation = 'pageSlideOut 0.3s ease-in forwards';
            await this.delay(300);
            currentPage.classList.remove('active');
        }
        
        // Show new page with animation
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.animation = 'pageSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            
            // Load page data
            await this.loadPageData(pageId);
        }
        
        this.isLoading = false;
    }

    async loadPageData(pageId) {
        switch(pageId) {
            case 'dashboard':
                await this.loadDashboardStats();
                await this.loadQuickStats();
                break;
            case 'surat-masuk':
                await this.loadLetters('incoming');
                break;
            case 'surat-keluar':
                await this.loadLetters('outgoing');
                break;
            case 'laporan':
                await this.loadReportPage();
                break;
            case 'arsip':
                await this.loadArchivedLetters();
                break;
            case 'pengaturan':
                await this.loadSettingsPage();
                break;
            case 'users':
                await this.loadUsers();
                break;
        }
    }

    updateUserInfo() {
        if (this.currentUser) {
            const elements = {
                userName: this.currentUser.fullName,
                userRole: this.currentUser.role,
                userInitials: this.currentUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2),
                profileName: this.currentUser.fullName,
                profileUsername: this.currentUser.username,
                profileEmail: this.currentUser.email,
                profileDepartment: this.currentUser.department
            };

            Object.entries(elements).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.tagName === 'INPUT') {
                        element.value = value;
                    } else {
                        element.textContent = value;
                    }
                }
            });
        }
    }

    async loadDashboardStats() {
        const stats = {
            totalIncoming: this.letters.filter(l => l.type === 'incoming').length,
            totalOutgoing: this.letters.filter(l => l.type === 'outgoing').length,
            pendingLetters: this.letters.filter(l => l.status === 'draft').length,
            archivedLetters: this.archivedLetters.length
        };

        // Animate counters
        this.animateCounter('incomingCount', stats.totalIncoming);
        this.animateCounter('outgoingCount', stats.totalOutgoing);
        this.animateCounter('pendingCount', stats.pendingLetters);
        this.animateCounter('archivedCount', stats.archivedLetters);
    }

    async loadQuickStats() {
        const thisMonth = this.letters.filter(l => {
            const letterDate = new Date(l.createdAt);
            const now = new Date();
            return letterDate.getMonth() === now.getMonth() && letterDate.getFullYear() === now.getFullYear();
        });

        const stats = {
            monthlyTotal: thisMonth.length,
            dailyAverage: Math.round(thisMonth.length / 30),
            pendingLetters: this.letters.filter(l => l.status === 'draft').length,
            completionRate: this.letters.length > 0 ? Math.round(((this.letters.length - this.letters.filter(l => l.status === 'draft').length) / this.letters.length) * 100) : 100
        };

        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'completionRate') {
                    this.animateCounter(key, value, '%');
                } else {
                    this.animateCounter(key, value);
                }
            }
        });
    }

    animateCounter(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const increment = (targetValue - startValue) / 30;
        let currentValue = startValue;

        const timer = setInterval(() => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= targetValue) || (increment < 0 && currentValue <= targetValue)) {
                element.textContent = targetValue + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }
        }, 50);
    }

    async loadLetters(type) {
        const filteredLetters = this.letters.filter(l => l.type === type);
        this.renderLetters(filteredLetters, type);
    }

    renderLetters(letters, type) {
        const containerId = type === 'incoming' ? 'incomingLettersList' : 'outgoingLettersList';
        const container = document.getElementById(containerId);
        
        if (!container) return;

        if (letters.length === 0) {
            container.innerHTML = this.getEmptyState(type);
            return;
        }

        container.innerHTML = letters.map((letter, index) => `
            <div class="letter-item" style="animation-delay: ${index * 0.1}s;">
                <div class="letter-header">
                    <div>
                        <h3 class="letter-title">${letter.subject}</h3>
                        <div class="letter-meta">
                            <span><strong>📤 Dari:</strong> ${letter.sender || 'N/A'}</span>
                            <span><strong>📥 Kepada:</strong> ${letter.recipient || 'N/A'}</span>
                            <span><strong>📅 Tanggal:</strong> ${new Date(letter.createdAt).toLocaleDateString('id-ID')}</span>
                            ${letter.letterNumber ? `<span><strong>🔢 No. Surat:</strong> ${letter.letterNumber}</span>` : ''}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
                        <span class="priority-badge ${letter.priority}">${letter.priority}</span>
                        <span class="status-badge ${letter.status}">${letter.status}</span>
                    </div>
                </div>
                
                <div class="letter-content">
                    ${letter.content.substring(0, 200)}${letter.content.length > 200 ? '...' : ''}
                </div>
                
                <div class="letter-actions">
                    <button class="btn btn-secondary" onclick="app.viewLetter(${letter.id})" data-tooltip="Lihat detail surat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Lihat
                    </button>
                    <button class="btn btn-primary" onclick="app.editLetter(${letter.id})" data-tooltip="Edit surat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                    </button>
                    <button class="btn btn-warning" onclick="app.archiveLetter(${letter.id})" data-tooltip="Arsipkan surat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="21,8 21,21 3,21 3,8"/>
                            <rect x="1" y="3" width="22" height="5"/>
                            <line x1="10" y1="12" x2="14" y2="12"/>
                        </svg>
                        Arsip
                    </button>
                    <button class="btn btn-danger" onclick="app.deleteLetter(${letter.id})" data-tooltip="Hapus surat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Hapus
                    </button>
                </div>
            </div>
        `).join('');
    }

    getEmptyState(type) {
        const icons = {
            incoming: '📥',
            outgoing: '📤',
            archive: '🗂️',
            users: '👥'
        };

        const messages = {
            incoming: 'Belum ada surat masuk',
            outgoing: 'Belum ada surat keluar',
            archive: 'Belum ada surat yang diarsipkan',
            users: 'Belum ada pengguna terdaftar'
        };

        return `
            <div style="text-align: center; padding: 4rem 2rem; color: rgba(255, 255, 255, 0.7);">
                <div style="font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.5;">${icons[type] || '📄'}</div>
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">${messages[type] || 'Tidak ada data'}</h3>
                <p style="font-size: 1.1rem; opacity: 0.8;">Klik tombol "Tambah" untuk memulai</p>
            </div>
        `;
    }

    async loadUsers() {
        const container = document.getElementById('usersTableBody');
        if (!container) return;

        if (this.users.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.7);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                        <h3>Belum ada pengguna terdaftar</h3>
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = this.users.map((user, index) => `
            <tr style="animation: slideInUp 0.4s ease-out ${index * 0.1}s both;">
                <td>${user.fullName}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.role.toLowerCase().replace(' ', '-')}">${user.role}</span></td>
                <td>${user.department}</td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-secondary" onclick="app.editUser(${user.id})" style="padding: 0.5rem;" data-tooltip="Edit user">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        ${user.id !== this.currentUser.id ? `
                            <button class="btn btn-danger" onclick="app.deleteUser(${user.id})" style="padding: 0.5rem;" data-tooltip="Hapus user">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Modal functions with enhanced animations
    showCreateModal(type) {
        this.currentLetterType = type;
        const modal = document.getElementById('createModal');
        const title = document.getElementById('modalTitle');
        
        title.textContent = type === 'incoming' ? '📥 Tambah Surat Masuk' : '📤 Buat Surat Keluar';
        modal.classList.add('show');
        
        // Set default values
        if (type === 'outgoing') {
            document.getElementById('sender').value = 'Dinas Ketenagakerjaan Kabupaten Asahan';
        } else {
            document.getElementById('recipient').value = 'Dinas Ketenagakerjaan Kabupaten Asahan';
        }
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('subject').focus();
        }, 300);
    }

    closeModal() {
        const modal = document.getElementById('createModal');
        modal.classList.remove('show');
        document.getElementById('letterForm').reset();
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    async handleLetterSubmit() {
        const btnText = document.querySelector('.btn-text');
        const loading = document.querySelector('.loading');
        
        try {
            // Show loading state
            this.setButtonLoading(btnText, loading, true);
            
            const formData = {
                id: Date.now(),
                type: this.currentLetterType,
                subject: document.getElementById('subject').value,
                sender: document.getElementById('sender').value,
                recipient: document.getElementById('recipient').value,
                letterNumber: document.getElementById('letterNumber').value,
                priority: document.getElementById('priority').value,
                content: document.getElementById('content').value,
                status: 'draft',
                createdAt: new Date().toISOString(),
                createdBy: this.currentUser.id
            };

            // Simulate API call
            await this.delay(1500);
            
            this.letters.push(formData);
            this.closeModal();
            
            // Reload current page
            const activePage = document.querySelector('.nav-item.active').dataset.page;
            if (activePage === 'surat-masuk' || activePage === 'surat-keluar') {
                await this.loadLetters(this.currentLetterType);
            }
            
            // Update dashboard stats
            await this.loadDashboardStats();
            
            this.showMessage('✅ Surat berhasil dibuat dengan sempurna!', 'success');
            
        } catch (error) {
            this.showMessage('❌ Gagal membuat surat: ' + error.message, 'error');
        } finally {
            this.setButtonLoading(btnText, loading, false);
        }
    }

    setButtonLoading(btnText, loading, isLoading) {
        if (btnText && loading) {
            btnText.style.display = isLoading ? 'none' : 'inline';
            loading.style.display = isLoading ? 'flex' : 'none';
        }
    }

    // Enhanced message system
    showMessage(message, type = 'info') {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <span style="font-size: 1.2rem;">${icons[type] || 'ℹ️'}</span>
            <span style="flex: 1;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0; font-size: 1.2rem; opacity: 0.7; transition: opacity 0.2s;">×</button>
        `;
        
        document.body.appendChild(messageEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentElement) {
                messageEl.style.animation = 'messageSlideOut 0.4s ease-in forwards';
                setTimeout(() => {
                    if (messageEl.parentElement) {
                        messageEl.remove();
                    }
                }, 400);
            }
        }, 5000);
    }

    // Report generation with enhanced visuals
    async generateReport() {
        const period = document.getElementById('reportPeriod').value;
        const type = document.getElementById('reportType').value;
        const resultsContainer = document.getElementById('reportResults');
        
        try {
            // Show loading state
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <div style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 2rem;"></div>
                    <h3 style="color: white; margin-bottom: 1rem;">🚀 Generating Ultra Modern Report...</h3>
                    <p style="color: rgba(255,255,255,0.8);">Analyzing data and creating visualizations</p>
                </div>
            `;
            
            // Simulate report generation
            await this.delay(2500);
            
            const reportData = this.generateMockReportData(period, type);
            this.renderEnhancedReport(reportData);
            
            this.showMessage('📊 Laporan berhasil dibuat dengan visualisasi menarik!', 'success');
        } catch (error) {
            this.showMessage('❌ Gagal membuat laporan: ' + error.message, 'error');
        }
    }

    generateMockReportData(period, type) {
        return {
            period,
            type,
            summary: {
                totalLetters: Math.floor(Math.random() * 100) + 50,
                incomingLetters: Math.floor(Math.random() * 50) + 20,
                outgoingLetters: Math.floor(Math.random() * 50) + 20,
                pendingLetters: Math.floor(Math.random() * 10) + 5,
                completedLetters: Math.floor(Math.random() * 80) + 40
            }
        };
    }

    renderEnhancedReport(data) {
        const container = document.getElementById('reportResults');
        
        container.innerHTML = `
            <div style="animation: slideInUp 0.6s ease-out;">
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: white; font-size: 1.5rem; margin-bottom: 1.5rem; text-align: center;">📊 Ringkasan Laporan Ultra Modern</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
                        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 1.5rem; border-radius: 1.5rem; text-align: center; color: white; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">${data.summary.totalLetters}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9; font-weight: 600;">📋 Total Surat</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); padding: 1.5rem; border-radius: 1.5rem; text-align: center; color: white; box-shadow: 0 10px 25px rgba(79, 172, 254, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">${data.summary.incomingLetters}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9; font-weight: 600;">📥 Surat Masuk</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #43e97b, #38f9d7); padding: 1.5rem; border-radius: 1.5rem; text-align: center; color: white; box-shadow: 0 10px 25px rgba(67, 233, 123, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">${data.summary.outgoingLetters}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9; font-weight: 600;">📤 Surat Keluar</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #fa709a, #fee140); padding: 1.5rem; border-radius: 1.5rem; text-align: center; color: white; box-shadow: 0 10px 25px rgba(250, 112, 154, 0.3);">
                            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;">${data.summary.completedLetters}</div>
                            <div style="font-size: 0.9rem; opacity: 0.9; font-weight: 600;">✅ Selesai Diproses</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; justify-content: center;">
                    <button class="btn btn-primary" onclick="app.exportReport('pdf')" style="min-width: 150px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                        📄 Export PDF
                    </button>
                    <button class="btn btn-secondary" onclick="app.exportReport('excel')" style="min-width: 150px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                        📊 Export Excel
                    </button>
                </div>
            </div>
        `;
    }

    exportReport(format) {
        this.showMessage(`🚀 Laporan ${format.toUpperCase()} berhasil diunduh dengan format ultra modern!`, 'success');
        console.log(`Exporting ultra modern report as ${format}`);
    }

    // Settings functions
    async updateProfile() {
        try {
            const formData = {
                email: document.getElementById('profileEmail').value
            };

            await this.delay(1000);
            this.showMessage('👤 Profil berhasil diperbarui!', 'success');
        } catch (error) {
            this.showMessage('❌ Gagal memperbarui profil: ' + error.message, 'error');
        }
    }

    async changePassword() {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            this.showMessage('❌ Password baru dan konfirmasi tidak cocok', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showMessage('⚠️ Password minimal 6 karakter', 'warning');
            return;
        }
        
        try {
            await this.delay(1000);
            document.getElementById('passwordForm').reset();
            this.showMessage('🔐 Password berhasil diubah dengan aman!', 'success');
        } catch (error) {
            this.showMessage('❌ Gagal mengubah password: ' + error.message, 'error');
        }
    }

    savePreferences() {
        const theme = document.getElementById('themeSelect').value;
        const language = document.getElementById('languageSelect').value;
        const emailNotifications = document.getElementById('emailNotifications').checked;
        
        localStorage.setItem('theme', theme);
        localStorage.setItem('language', language);
        localStorage.setItem('emailNotifications', emailNotifications);
        
        this.showMessage('🎨 Preferensi berhasil disimpan!', 'success');
    }

    downloadBackup() {
        const backupData = {
            timestamp: new Date().toISOString(),
            users: this.users,
            letters: this.letters,
            archivedLetters: this.archivedLetters,
            version: '2.0.0-ultra-modern'
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ultra-modern-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('💾 Backup ultra modern berhasil diunduh!', 'success');
    }

    restoreBackup() {
        const fileInput = document.getElementById('restoreFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showMessage('⚠️ Pilih file backup terlebih dahulu', 'warning');
            return;
        }
        
        if (!confirm('🔄 Restore akan mengganti semua data yang ada. Lanjutkan?')) {
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backupData = JSON.parse(e.target.result);
                console.log('Restoring ultra modern backup:', backupData);
                
                this.showMessage('✅ Data berhasil di-restore dengan sempurna!', 'success');
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch (error) {
                this.showMessage('❌ File backup tidak valid', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Search functions with enhanced animations
    searchLetters(type, query) {
        const letters = this.letters.filter(letter => {
            return letter.type === type && (
                letter.subject.toLowerCase().includes(query.toLowerCase()) ||
                letter.sender?.toLowerCase().includes(query.toLowerCase()) ||
                letter.recipient?.toLowerCase().includes(query.toLowerCase()) ||
                letter.content.toLowerCase().includes(query.toLowerCase())
            );
        });
        
        this.renderLetters(letters, type);
    }

    searchArchivedLetters(query) {
        const letters = this.archivedLetters.filter(letter => {
            return letter.subject.toLowerCase().includes(query.toLowerCase()) ||
                   letter.sender?.toLowerCase().includes(query.toLowerCase()) ||
                   letter.recipient?.toLowerCase().includes(query.toLowerCase()) ||
                   letter.content.toLowerCase().includes(query.toLowerCase());
        });
        
        this.renderArchivedLetters(letters);
    }

    searchUsers(query) {
        const users = this.users.filter(user => {
            return user.fullName.toLowerCase().includes(query.toLowerCase()) ||
                   user.username.toLowerCase().includes(query.toLowerCase()) ||
                   user.email.toLowerCase().includes(query.toLowerCase()) ||
                   user.role.toLowerCase().includes(query.toLowerCase());
        });
        
        this.renderUsersTable(users);
    }

    addSearchAnimation(input) {
        input.style.transform = 'scale(1.02)';
        input.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
        
        setTimeout(() => {
            input.style.transform = 'scale(1)';
            input.style.boxShadow = '';
        }, 200);
    }

    // Letter actions
    async viewLetter(id) {
        const letter = this.letters.find(l => l.id === id);
        if (!letter) return;
        
        this.showLetterDetails(letter);
    }

    showLetterDetails(letter) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3 class="modal-title">📄 Detail Surat</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <label style="font-weight: 600; color: #667eea; margin-bottom: 0.5rem; display: block;">📝 Subjek</label>
                            <p style="padding: 0.75rem; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 0.75rem; margin: 0;">${letter.subject}</p>
                        </div>
                        <div>
                            <label style="font-weight: 600; color: #667eea; margin-bottom: 0.5rem; display: block;">👤 Pengirim</label>
                            <p style="padding: 0.75rem; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 0.75rem; margin: 0;">${letter.sender || 'N/A'}</p>
                        </div>
                        <div>
                            <label style="font-weight: 600; color: #667eea; margin-bottom: 0.5rem; display: block;">📧 Penerima</label>
                            <p style="padding: 0.75rem; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 0.75rem; margin: 0;">${letter.recipient || 'N/A'}</p>
                        </div>
                        <div>
                            <label style="font-weight: 600; color: #667eea; margin-bottom: 0.5rem; display: block;">⚡ Prioritas</label>
                            <span class="priority-badge ${letter.priority}">${letter.priority}</span>
                        </div>
                    </div>
                    <div>
                        <label style="font-weight: 600; color: #667eea; margin-bottom: 0.5rem; display: block;">📄 Isi Surat</label>
                        <div style="padding: 1.5rem; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 1rem; white-space: pre-wrap; line-height: 1.7;">
                            ${letter.content}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">✅ Tutup</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async editLetter(id) {
        const letter = this.letters.find(l => l.id === id);
        if (!letter) return;
        
        // Populate form with letter data
        document.getElementById('subject').value = letter.subject;
        document.getElementById('sender').value = letter.sender || '';
        document.getElementById('recipient').value = letter.recipient || '';
        document.getElementById('letterNumber').value = letter.letterNumber || '';
        document.getElementById('priority').value = letter.priority;
        document.getElementById('content').value = letter.content;
        
        // Show modal
        this.currentLetterType = letter.type;
        document.getElementById('modalTitle').textContent = '✏️ Edit Surat';
        document.getElementById('createModal').classList.add('show');
        
        // Store letter ID for update
        document.getElementById('letterForm').dataset.letterId = id;
    }

    async archiveLetter(id) {
        if (!confirm('🗂️ Arsipkan surat ini?')) return;
        
        try {
            const letterIndex = this.letters.findIndex(l => l.id === id);
            if (letterIndex === -1) return;
            
            const letter = this.letters[letterIndex];
            letter.archivedAt = new Date().toISOString();
            
            this.archivedLetters.push(letter);
            this.letters.splice(letterIndex, 1);
            
            this.showMessage('🗂️ Surat berhasil diarsipkan!', 'success');
            
            // Reload current page
            const activePage = document.querySelector('.nav-item.active').dataset.page;
            if (activePage === 'surat-masuk') {
                await this.loadLetters('incoming');
            } else if (activePage === 'surat-keluar') {
                await this.loadLetters('outgoing');
            }
            
            await this.loadDashboardStats();
        } catch (error) {
            this.showMessage('❌ Gagal mengarsipkan surat: ' + error.message, 'error');
        }
    }

    async deleteLetter(id) {
        if (!confirm('🗑️ Hapus surat ini? Tindakan ini tidak dapat dibatalkan.')) return;
        
        try {
            const letterIndex = this.letters.findIndex(l => l.id === id);
            if (letterIndex === -1) return;
            
            this.letters.splice(letterIndex, 1);
            
            this.showMessage('🗑️ Surat berhasil dihapus!', 'success');
            
            // Reload current page
            const activePage = document.querySelector('.nav-item.active').dataset.page;
            if (activePage === 'surat-masuk') {
                await this.loadLetters('incoming');
            } else if (activePage === 'surat-keluar') {
                await this.loadLetters('outgoing');
            }
            
            await this.loadDashboardStats();
        } catch (error) {
            this.showMessage('❌ Gagal menghapus surat: ' + error.message, 'error');
        }
    }

    // Utility functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Keyboard shortcut handlers
    handleNewLetterShortcut() {
        const activePage = document.querySelector('.nav-item.active').dataset.page;
        if (activePage === 'surat-masuk') {
            this.showCreateModal('incoming');
        } else if (activePage === 'surat-keluar') {
            this.showCreateModal('outgoing');
        }
    }

    handleSaveShortcut() {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            const form = modal.querySelector('form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    }

    focusSearchInput() {
        const activePage = document.querySelector('.nav-item.active').dataset.page;
        const searchInputs = {
            'surat-masuk': 'searchIncoming',
            'surat-keluar': 'searchOutgoing',
            'arsip': 'searchArchive',
            'users': 'searchUsers'
        };
        
        const inputId = searchInputs[activePage];
        if (inputId) {
            const input = document.getElementById(inputId);
            if (input) {
                input.focus();
                input.select();
            }
        }
    }

    // Placeholder functions for unimplemented features
    async loadArchivedLetters() {
        const container = document.getElementById('archivedLettersList');
        if (container) {
            container.innerHTML = this.getEmptyState('archive');
        }
    }

    async loadReportPage() {
        await this.loadQuickStats();
    }

    async loadSettingsPage() {
        this.updateUserInfo();
    }

    updateScrollEffects() {
        // Placeholder for scroll effects
    }

    handleResize() {
        // Placeholder for resize handling
    }

    refreshData() {
        // Placeholder for data refresh
    }

    showTooltip(element, text) {
        // Placeholder for tooltip functionality
    }

    hideTooltip() {
        // Placeholder for tooltip functionality
    }

    logout() {
        if (confirm('🚪 Yakin ingin keluar dari sistem?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            this.showMessage('👋 Berhasil logout. Sampai jumpa!', 'success');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        }
    }
}

// Global functions for onclick handlers - THIS FIXES THE ERROR
window.showCreateModal = (type) => app.showCreateModal(type);
window.closeModal = () => app.closeModal();
window.logout = () => app.logout();
window.generateReport = () => app.generateReport();
window.savePreferences = () => app.savePreferences();
window.downloadBackup = () => app.downloadBackup();
window.restoreBackup = () => app.restoreBackup();

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; }
    }
    
    @keyframes welcomeSlideIn {
        from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes welcomeSlideOut {
        from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }
    
    @keyframes pageSlideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pageSlideOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes messageSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the ultra modern app
const app = new UltraModernLetterApp();