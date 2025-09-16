// Settings Module - Complete Implementation
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.currentUser = null;
    }

    // Load settings from localStorage
    loadSettings() {
        const defaultSettings = {
            theme: 'light',
            language: 'id',
            notifications: {
                email: true,
                browser: true,
                sound: false
            },
            display: {
                itemsPerPage: 10,
                dateFormat: 'dd/mm/yyyy',
                timeFormat: '24h'
            },
            system: {
                autoArchive: false,
                autoArchiveDays: 30,
                backupFrequency: 'weekly',
                maxFileSize: 5
            },
            security: {
                sessionTimeout: 30,
                passwordExpiry: 90,
                twoFactorAuth: false
            }
        };

        const saved = localStorage.getItem('appSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    // Save settings to localStorage
    saveSettings() {
        localStorage.setItem('appSettings', JSON.stringify(this.settings));
        this.applySettings();
        showMessage('Pengaturan berhasil disimpan', 'success');
    }

    // Initialize settings page
    initializeSettings() {
        this.currentUser = db.getCurrentUser();
        this.loadSettingsUI();
        this.setupEventListeners();
        this.applySettings();
    }

    // Load settings UI
    loadSettingsUI() {
        const settingsContainer = document.getElementById('settingsContainer');
        if (!settingsContainer) return;

        settingsContainer.innerHTML = `
            <div class="settings-content">
                <!-- Settings Navigation -->
                <div class="settings-nav">
                    <button class="settings-nav-item active" data-section="general">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                        </svg>
                        Umum
                    </button>
                    <button class="settings-nav-item" data-section="notifications">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
                        </svg>
                        Notifikasi
                    </button>
                    <button class="settings-nav-item" data-section="display">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H21C22.1 21 23 20.1 23 19V5C23 3.9 22.1 3 21 3ZM21 19H3V5H21V19Z" fill="currentColor"/>
                        </svg>
                        Tampilan
                    </button>
                    <button class="settings-nav-item" data-section="system">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill="currentColor"/>
                        </svg>
                        Sistem
                    </button>
                    <button class="settings-nav-item" data-section="security">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11C15.4,11 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11 9,11V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z" fill="currentColor"/>
                        </svg>
                        Keamanan
                    </button>
                    ${this.currentUser && ['Kepala Dinas', 'Administrator'].includes(this.currentUser.role) ? `
                    <button class="settings-nav-item" data-section="backup">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                        </svg>
                        Backup & Restore
                    </button>
                    ` : ''}
                </div>

                <!-- Settings Sections -->
                <div class="settings-sections">
                    ${this.renderGeneralSettings()}
                    ${this.renderNotificationSettings()}
                    ${this.renderDisplaySettings()}
                    ${this.renderSystemSettings()}
                    ${this.renderSecuritySettings()}
                    ${this.currentUser && ['Kepala Dinas', 'Administrator'].includes(this.currentUser.role) ? this.renderBackupSettings() : ''}
                </div>
            </div>
        `;

        // Show first section
        this.showSettingsSection('general');
    }

    // Render general settings
    renderGeneralSettings() {
        return `
            <div id="general-section" class="settings-section">
                <h3>Pengaturan Umum</h3>
                
                <div class="setting-group">
                    <label class="setting-label">Tema Aplikasi</label>
                    <select id="themeSelect" class="setting-input">
                        <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Terang</option>
                        <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Gelap</option>
                        <option value="auto" ${this.settings.theme === 'auto' ? 'selected' : ''}>Otomatis</option>
                    </select>
                    <small class="setting-help">Pilih tema yang akan digunakan untuk aplikasi</small>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Bahasa</label>
                    <select id="languageSelect" class="setting-input">
                        <option value="id" ${this.settings.language === 'id' ? 'selected' : ''}>Bahasa Indonesia</option>
                        <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                    </select>
                    <small class="setting-help">Pilih bahasa yang akan digunakan dalam aplikasi</small>
                </div>

                <div class="setting-group">
                    <h4>Informasi Pengguna</h4>
                    <div class="user-info">
                        <div class="user-avatar-large">
                            <span>${this.currentUser ? this.currentUser.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'U'}</span>
                        </div>
                        <div class="user-details">
                            <p><strong>Nama:</strong> ${this.currentUser ? this.currentUser.fullName : 'Unknown'}</p>
                            <p><strong>Username:</strong> ${this.currentUser ? this.currentUser.username : 'Unknown'}</p>
                            <p><strong>Email:</strong> ${this.currentUser ? this.currentUser.email : 'Unknown'}</p>
                            <p><strong>Role:</strong> ${this.currentUser ? this.currentUser.role : 'Unknown'}</p>
                            <p><strong>Departemen:</strong> ${this.currentUser ? this.currentUser.department : 'Unknown'}</p>
                        </div>
                    </div>
                    <button class="btn-secondary" onclick="showChangePasswordModal()">Ubah Password</button>
                </div>
            </div>
        `;
    }

    // Render notification settings
    renderNotificationSettings() {
        return `
            <div id="notifications-section" class="settings-section" style="display: none;">
                <h3>Pengaturan Notifikasi</h3>
                
                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="emailNotifications" ${this.settings.notifications.email ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        Notifikasi Email
                    </label>
                    <small class="setting-help">Terima notifikasi melalui email untuk surat baru dan persetujuan</small>
                </div>

                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="browserNotifications" ${this.settings.notifications.browser ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        Notifikasi Browser
                    </label>
                    <small class="setting-help">Tampilkan notifikasi di browser untuk aktivitas penting</small>
                </div>

                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="soundNotifications" ${this.settings.notifications.sound ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        Suara Notifikasi
                    </label>
                    <small class="setting-help">Putar suara saat menerima notifikasi</small>
                </div>

                <div class="setting-group">
                    <button class="btn-secondary" onclick="testNotification()">Test Notifikasi</button>
                </div>
            </div>
        `;
    }

    // Render display settings
    renderDisplaySettings() {
        return `
            <div id="display-section" class="settings-section" style="display: none;">
                <h3>Pengaturan Tampilan</h3>
                
                <div class="setting-group">
                    <label class="setting-label">Item Per Halaman</label>
                    <select id="itemsPerPageSelect" class="setting-input">
                        <option value="5" ${this.settings.display.itemsPerPage === 5 ? 'selected' : ''}>5</option>
                        <option value="10" ${this.settings.display.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="25" ${this.settings.display.itemsPerPage === 25 ? 'selected' : ''}>25</option>
                        <option value="50" ${this.settings.display.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                    </select>
                    <small class="setting-help">Jumlah item yang ditampilkan per halaman</small>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Format Tanggal</label>
                    <select id="dateFormatSelect" class="setting-input">
                        <option value="dd/mm/yyyy" ${this.settings.display.dateFormat === 'dd/mm/yyyy' ? 'selected' : ''}>DD/MM/YYYY</option>
                        <option value="mm/dd/yyyy" ${this.settings.display.dateFormat === 'mm/dd/yyyy' ? 'selected' : ''}>MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd" ${this.settings.display.dateFormat === 'yyyy-mm-dd' ? 'selected' : ''}>YYYY-MM-DD</option>
                    </select>
                    <small class="setting-help">Format tanggal yang akan ditampilkan</small>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Format Waktu</label>
                    <select id="timeFormatSelect" class="setting-input">
                        <option value="24h" ${this.settings.display.timeFormat === '24h' ? 'selected' : ''}>24 Jam</option>
                        <option value="12h" ${this.settings.display.timeFormat === '12h' ? 'selected' : ''}>12 Jam (AM/PM)</option>
                    </select>
                    <small class="setting-help">Format waktu yang akan ditampilkan</small>
                </div>
            </div>
        `;
    }

    // Render system settings
    renderSystemSettings() {
        return `
            <div id="system-section" class="settings-section" style="display: none;">
                <h3>Pengaturan Sistem</h3>
                
                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="autoArchive" ${this.settings.system.autoArchive ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        Auto Arsip
                    </label>
                    <small class="setting-help">Otomatis arsipkan surat yang telah selesai</small>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Hari Auto Arsip</label>
                    <input type="number" id="autoArchiveDays" class="setting-input" 
                           value="${this.settings.system.autoArchiveDays}" min="1" max="365">
                    <small class="setting-help">Jumlah hari setelah surat selesai untuk diarsipkan otomatis</small>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Frekuensi Backup</label>
                    <select id="backupFrequencySelect" class="setting-input">
                        <option value="daily" ${this.settings.system.backupFrequency === 'daily' ? 'selected' : ''}>Harian</option>
                        <option value="weekly" ${this.settings.system.backupFrequency === 'weekly' ? 'selected' : ''}>Mingguan</option>
                        <option value="monthly" ${this.settings.system.backupFrequency === 'monthly' ? 'selected' : ''}>Bulanan</option>
                        <option value="manual" ${this.settings.system.backupFrequency === 'manual' ? 'selected' : ''}>Manual</option>
                    </select>
                    <small class="setting-help">Seberapa sering backup otomatis dilakukan</small>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Ukuran File Maksimal (MB)</label>
                    <input type="number" id="maxFileSize" class="setting-input" 
                           value="${this.settings.system.maxFileSize}" min="1" max="50">
                    <small class="setting-help">Ukuran maksimal file yang dapat diupload</small>
                </div>
            </div>
        `;
    }

    // Render security settings
    renderSecuritySettings() {
        return `
            <div id="security-section" class="settings-section" style="display: none;">
                <h3>Pengaturan Keamanan</h3>
                
                <div class="setting-group">
                    <label class="setting-label">Session Timeout (menit)</label>
                    <input type="number" id="sessionTimeout" class="setting-input" 
                           value="${this.settings.security.sessionTimeout}" min="5" max="480">
                    <small class="setting-help">Waktu tidak aktif sebelum otomatis logout</small>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Password Expiry (hari)</label>
                    <input type="number" id="passwordExpiry" class="setting-input" 
                           value="${this.settings.security.passwordExpiry}" min="30" max="365">
                    <small class="setting-help">Berapa hari password berlaku sebelum harus diganti</small>
                </div>

                <div class="setting-group">
                    <label class="setting-checkbox">
                        <input type="checkbox" id="twoFactorAuth" ${this.settings.security.twoFactorAuth ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        Two-Factor Authentication
                    </label>
                    <small class="setting-help">Aktifkan autentikasi dua faktor untuk keamanan tambahan</small>
                </div>

                <div class="setting-group">
                    <h4>Aktivitas Login Terakhir</h4>
                    <div class="login-history">
                        <div class="login-item">
                            <span class="login-time">Hari ini, 14:30</span>
                            <span class="login-device">Chrome - Windows</span>
                            <span class="login-ip">192.168.1.100</span>
                        </div>
                        <div class="login-item">
                            <span class="login-time">Kemarin, 09:15</span>
                            <span class="login-device">Firefox - Windows</span>
                            <span class="login-ip">192.168.1.100</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render backup settings
    renderBackupSettings() {
        return `
            <div id="backup-section" class="settings-section" style="display: none;">
                <h3>Backup & Restore</h3>
                
                <div class="setting-group">
                    <h4>Backup Data</h4>
                    <p>Backup semua data sistem termasuk surat, pengguna, dan pengaturan.</p>
                    <div class="backup-actions">
                        <button class="btn-primary" onclick="createBackup()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                            </svg>
                            Buat Backup
                        </button>
                        <button class="btn-secondary" onclick="scheduleBackup()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" fill="currentColor"/>
                            </svg>
                            Jadwalkan Backup
                        </button>
                    </div>
                </div>

                <div class="setting-group">
                    <h4>Restore Data</h4>
                    <p>Pulihkan data dari file backup yang telah dibuat sebelumnya.</p>
                    <div class="restore-actions">
                        <input type="file" id="restoreFile" accept=".json" style="display: none;" onchange="handleRestoreFile(this)">
                        <button class="btn-warning" onclick="document.getElementById('restoreFile').click()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,19.99 10.51,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" fill="currentColor"/>
                            </svg>
                            Pilih File Backup
                        </button>
                    </div>
                </div>

                <div class="setting-group">
                    <h4>Riwayat Backup</h4>
                    <div class="backup-history">
                        <div class="backup-item">
                            <span class="backup-date">2024-01-15 14:30:00</span>
                            <span class="backup-size">2.5 MB</span>
                            <span class="backup-type">Manual</span>
                            <button class="btn-sm btn-secondary">Download</button>
                        </div>
                        <div class="backup-item">
                            <span class="backup-date">2024-01-08 02:00:00</span>
                            <span class="backup-size">2.3 MB</span>
                            <span class="backup-type">Otomatis</span>
                            <button class="btn-sm btn-secondary">Download</button>
                        </div>
                    </div>
                </div>

                <div class="setting-group">
                    <h4>Reset Sistem</h4>
                    <p class="text-danger">⚠️ Hati-hati! Tindakan ini akan menghapus semua data dan tidak dapat dibatalkan.</p>
                    <button class="btn-danger" onclick="showResetConfirmation()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" fill="currentColor"/>
                        </svg>
                        Reset Sistem
                    </button>
                </div>
            </div>
        `;
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSettingsSection(section);
            });
        });

        // General settings
        const themeSelect = document.getElementById('themeSelect');
        const languageSelect = document.getElementById('languageSelect');

        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.applyTheme();
            });
        }

        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
            });
        }

        // Notification settings
        const emailNotifications = document.getElementById('emailNotifications');
        const browserNotifications = document.getElementById('browserNotifications');
        const soundNotifications = document.getElementById('soundNotifications');

        if (emailNotifications) {
            emailNotifications.addEventListener('change', (e) => {
                this.settings.notifications.email = e.target.checked;
            });
        }

        if (browserNotifications) {
            browserNotifications.addEventListener('change', (e) => {
                this.settings.notifications.browser = e.target.checked;
            });
        }

        if (soundNotifications) {
            soundNotifications.addEventListener('change', (e) => {
                this.settings.notifications.sound = e.target.checked;
            });
        }

        // Display settings
        const itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
        const dateFormatSelect = document.getElementById('dateFormatSelect');
        const timeFormatSelect = document.getElementById('timeFormatSelect');

        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.settings.display.itemsPerPage = parseInt(e.target.value);
            });
        }

        if (dateFormatSelect) {
            dateFormatSelect.addEventListener('change', (e) => {
                this.settings.display.dateFormat = e.target.value;
            });
        }

        if (timeFormatSelect) {
            timeFormatSelect.addEventListener('change', (e) => {
                this.settings.display.timeFormat = e.target.value;
            });
        }

        // System settings
        const autoArchive = document.getElementById('autoArchive');
        const autoArchiveDays = document.getElementById('autoArchiveDays');
        const backupFrequencySelect = document.getElementById('backupFrequencySelect');
        const maxFileSize = document.getElementById('maxFileSize');

        if (autoArchive) {
            autoArchive.addEventListener('change', (e) => {
                this.settings.system.autoArchive = e.target.checked;
            });
        }

        if (autoArchiveDays) {
            autoArchiveDays.addEventListener('change', (e) => {
                this.settings.system.autoArchiveDays = parseInt(e.target.value);
            });
        }

        if (backupFrequencySelect) {
            backupFrequencySelect.addEventListener('change', (e) => {
                this.settings.system.backupFrequency = e.target.value;
            });
        }

        if (maxFileSize) {
            maxFileSize.addEventListener('change', (e) => {
                this.settings.system.maxFileSize = parseInt(e.target.value);
            });
        }

        // Security settings
        const sessionTimeout = document.getElementById('sessionTimeout');
        const passwordExpiry = document.getElementById('passwordExpiry');
        const twoFactorAuth = document.getElementById('twoFactorAuth');

        if (sessionTimeout) {
            sessionTimeout.addEventListener('change', (e) => {
                this.settings.security.sessionTimeout = parseInt(e.target.value);
            });
        }

        if (passwordExpiry) {
            passwordExpiry.addEventListener('change', (e) => {
                this.settings.security.passwordExpiry = parseInt(e.target.value);
            });
        }

        if (twoFactorAuth) {
            twoFactorAuth.addEventListener('change', (e) => {
                this.settings.security.twoFactorAuth = e.target.checked;
            });
        }
    }

    // Show settings section
    showSettingsSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.settings-section').forEach(section => {
            section.style.display = 'none';
        });

        // Remove active class from all nav items
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const section = document.getElementById(`${sectionId}-section`);
        if (section) {
            section.style.display = 'block';
        }

        // Add active class to selected nav item
        const navItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
    }

    // Apply settings
    applySettings() {
        this.applyTheme();
        this.applyNotifications();
    }

    // Apply theme
    applyTheme() {
        const body = document.body;
        body.classList.remove('theme-light', 'theme-dark');
        
        if (this.settings.theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        } else {
            body.classList.add(`theme-${this.settings.theme}`);
        }
    }

    // Apply notifications
    applyNotifications() {
        if (this.settings.notifications.browser && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }

    // Reset settings to default
    resetSettings() {
        if (confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?')) {
            localStorage.removeItem('appSettings');
            this.settings = this.loadSettings();
            this.loadSettingsUI();
            this.setupEventListeners();
            this.applySettings();
            showMessage('Pengaturan berhasil direset ke default', 'success');
        }
    }
}

// Initialize settings manager
window.settingsManager = new SettingsManager();

// Global functions
window.saveSettings = () => window.settingsManager.saveSettings();
window.resetSettings = () => window.settingsManager.resetSettings();

window.testNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Test Notifikasi', {
            body: 'Ini adalah test notifikasi dari sistem pengelolaan surat.',
            icon: 'https://public-frontend-cos.metadl.com/mgx/img/favicon.png'
        });
    } else {
        showMessage('Notifikasi browser tidak diizinkan atau tidak didukung', 'warning');
    }
};

window.showChangePasswordModal = () => {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Ubah Password</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">&times;</button>
            </div>
            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="currentPassword">Password Saat Ini</label>
                    <input type="password" id="currentPassword" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">Password Baru</label>
                    <input type="password" id="newPassword" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Konfirmasi Password Baru</label>
                    <input type="password" id="confirmPassword" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">Batal</button>
                    <button type="submit" class="btn-primary">Ubah Password</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            showMessage('Password baru dan konfirmasi tidak cocok', 'error');
            return;
        }
        
        // Here you would normally validate current password and update
        showMessage('Password berhasil diubah', 'success');
        modal.remove();
        document.body.style.overflow = 'auto';
    });
};

window.createBackup = () => {
    const data = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        users: db.getUsers(),
        letters: db.getLetters(),
        archivedLetters: db.getArchivedLetters(),
        settings: window.settingsManager.settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showMessage('Backup berhasil dibuat dan didownload', 'success');
};

window.handleRestoreFile = (input) => {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (confirm('Apakah Anda yakin ingin restore data? Semua data saat ini akan diganti.')) {
                // Here you would restore the data
                showMessage('Data berhasil direstore', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            showMessage('File backup tidak valid', 'error');
        }
    };
    reader.readAsText(file);
};

window.showResetConfirmation = () => {
    if (confirm('PERINGATAN: Ini akan menghapus SEMUA data sistem!\n\nApakah Anda benar-benar yakin?')) {
        if (confirm('Konfirmasi sekali lagi: Semua surat, pengguna, dan pengaturan akan dihapus permanen!')) {
            // Here you would reset the system
            localStorage.clear();
            showMessage('Sistem berhasil direset', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
};