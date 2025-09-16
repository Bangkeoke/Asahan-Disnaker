// Settings page functionality
class SettingsHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupProfileForm();
        this.setupPasswordForm();
        this.setupUserManagement();
        this.loadCurrentUser();
    }

    async loadCurrentUser() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser.id) {
                this.populateProfileForm(currentUser);
            }
        } catch (error) {
            console.error('Error loading current user:', error);
        }
    }

    populateProfileForm(user) {
        const elements = {
            'profileName': user.fullName || '',
            'profileUsername': user.username || '',
            'profileEmail': user.email || '',
            'profileDepartment': user.department || ''
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            }
        });
    }

    setupProfileForm() {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.updateProfile();
            });
        }
    }

    setupPasswordForm() {
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.changePassword();
            });
        }
    }

    async updateProfile() {
        const fullName = document.getElementById('profileName').value;
        const email = document.getElementById('profileEmail').value;
        const department = document.getElementById('profileDepartment').value;

        if (!email) {
            this.showMessage('Email tidak boleh kosong', 'error');
            return;
        }

        try {
            const response = await ApiUtils.fetchWithAuth('/api/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    fullName,
                    email,
                    department
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update localStorage with new user data
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                this.showMessage('Profil berhasil diperbarui!', 'success');
                
                // Update UI elements that display user info
                this.updateUserInfoInUI(data.user);
            } else {
                this.showMessage(data.error || 'Gagal memperbarui profil', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showMessage('Terjadi kesalahan saat memperbarui profil', 'error');
        }
    }

    async changePassword() {
        const currentPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showMessage('Semua field password harus diisi', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showMessage('Password baru dan konfirmasi tidak cocok', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showMessage('Password baru minimal 6 karakter', 'error');
            return;
        }

        try {
            const response = await ApiUtils.fetchWithAuth('/api/change-password', {
                method: 'PUT',
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('Password berhasil diubah!', 'success');
                document.getElementById('passwordForm').reset();
            } else {
                this.showMessage(data.error || 'Gagal mengubah password', 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            this.showMessage('Terjadi kesalahan saat mengubah password', 'error');
        }
    }

    updateUserInfoInUI(user) {
        // Update user info in header
        const userNameElement = document.getElementById('userName');
        const userRoleElement = document.getElementById('userRole');
        const userInitialsElement = document.getElementById('userInitials');

        if (userNameElement) userNameElement.textContent = user.fullName;
        if (userRoleElement) userRoleElement.textContent = user.role;
        if (userInitialsElement) {
            const initials = user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2);
            userInitialsElement.textContent = initials;
        }
    }

    setupUserManagement() {
        // Setup add user modal
        const addUserBtn = document.querySelector('[onclick="showCreateUserModal()"]');
        if (addUserBtn) {
            addUserBtn.onclick = () => this.showCreateUserModal();
        }
    }

    showCreateUserModal() {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>👤 Tambah User Baru</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">&times;</button>
                </div>
                <form id="createUserForm">
                    <div class="form-group">
                        <label for="newUserFullName">Nama Lengkap</label>
                        <input type="text" id="newUserFullName" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserUsername">Username</label>
                        <input type="text" id="newUserUsername" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserEmail">Email</label>
                        <input type="email" id="newUserEmail" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="newUserDepartment">Departemen</label>
                        <select id="newUserDepartment" class="form-select" required>
                            <option value="">Pilih Departemen</option>
                            <option value="Sekretariat">Sekretariat</option>
                            <option value="Bidang Penempatan dan Perluasan Kerja">Bidang Penempatan dan Perluasan Kerja</option>
                            <option value="Bidang Hubungan Industrial dan Persyaratan Kerja">Bidang Hubungan Industrial dan Persyaratan Kerja</option>
                            <option value="Bidang Pelatihan dan Produktivitas Tenaga Kerja">Bidang Pelatihan dan Produktivitas Tenaga Kerja</option>
                            <option value="IT Support">IT Support</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newUserRole">Role</label>
                        <select id="newUserRole" class="form-select" required>
                            <option value="">Pilih Role</option>
                            <option value="Staff">Staff</option>
                            <option value="Kepala Bidang">Kepala Bidang</option>
                            <option value="Sekretaris">Sekretaris</option>
                            <option value="Kepala Dinas">Kepala Dinas</option>
                            <option value="Administrator">Administrator</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newUserPassword">Password</label>
                        <input type="password" id="newUserPassword" class="form-input" required minlength="6">
                        <small>Minimal 6 karakter</small>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">Batal</button>
                        <button type="submit" class="btn btn-primary">Tambah User</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        document.getElementById('createUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createUser(modal);
        });
    }

    async createUser(modal) {
        const formData = {
            fullName: document.getElementById('newUserFullName').value,
            username: document.getElementById('newUserUsername').value,
            email: document.getElementById('newUserEmail').value,
            department: document.getElementById('newUserDepartment').value,
            role: document.getElementById('newUserRole').value,
            password: document.getElementById('newUserPassword').value
        };

        try {
            const response = await ApiUtils.fetchWithAuth('/api/users', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('User berhasil ditambahkan!', 'success');
                modal.remove();
                document.body.style.overflow = 'auto';
                
                // Reload users list if we're on users page
                if (window.app && typeof window.app.loadUsers === 'function') {
                    window.app.loadUsers();
                }
            } else {
                this.showMessage(data.error || 'Gagal menambah user', 'error');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            this.showMessage('Terjadi kesalahan saat menambah user', 'error');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            return;
        }

        try {
            const response = await ApiUtils.fetchWithAuth(`/api/users/${userId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                this.showMessage('User berhasil dihapus!', 'success');
                
                // Reload users list if we're on users page
                if (window.app && typeof window.app.loadUsers === 'function') {
                    window.app.loadUsers();
                }
            } else {
                this.showMessage(data.error || 'Gagal menghapus user', 'error');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showMessage('Terjadi kesalahan saat menghapus user', 'error');
        }
    }

    showMessage(message, type = 'info') {
        ApiUtils.showMessage(message, type);
    }
}

// Initialize settings handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/dashboard') {
        window.settingsHandler = new SettingsHandler();
    }
});

// Global functions for compatibility
window.showCreateUserModal = () => {
    if (window.settingsHandler) {
        window.settingsHandler.showCreateUserModal();
    }
};

window.deleteUser = (userId) => {
    if (window.settingsHandler) {
        window.settingsHandler.deleteUser(userId);
    }
};

window.savePreferences = () => {
    const theme = document.getElementById('themeSelect').value;
    const language = document.getElementById('languageSelect').value;
    const emailNotifications = document.getElementById('emailNotifications').checked;
    
    // Save preferences to localStorage
    const preferences = { theme, language, emailNotifications };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    if (window.settingsHandler) {
        window.settingsHandler.showMessage('Preferensi berhasil disimpan!', 'success');
    }
};