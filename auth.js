// Authentication handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in via server API
    checkAuthStatus();

    // Tab switching
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            
            if (!username || !password) {
                showMessage('Mohon isi username dan password', 'error');
                return;
            }
            
            // Use server API for login
            loginUser(username, password);
        });
    }

    // Register form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const userData = {
                fullName: formData.get('fullName'),
                username: formData.get('username'),
                email: formData.get('email'),
                department: formData.get('department'),
                role: formData.get('role'),
                password: formData.get('password')
            };
            
            // Validation
            if (!userData.fullName || !userData.username || !userData.email || 
                !userData.department || !userData.role || !userData.password) {
                showMessage('Mohon isi semua field yang diperlukan', 'error');
                return;
            }
            
            // Check if username already exists
            if (db.getUserByUsername(userData.username)) {
                showMessage('Username sudah digunakan', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                showMessage('Format email tidak valid', 'error');
                return;
            }
            
            // Password validation
            if (userData.password.length < 6) {
                showMessage('Password minimal 6 karakter', 'error');
                return;
            }
            
            try {
                const newUser = db.createUser(userData);
                if (newUser) {
                    showMessage('Registrasi berhasil! Silakan login dengan akun baru Anda.', 'success');
                    registerForm.reset();
                    
                    // Switch to login tab
                    setTimeout(() => {
                        document.querySelector('[data-tab="login"]').click();
                    }, 2000);
                } else {
                    showMessage('Gagal membuat akun. Silakan coba lagi.', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Terjadi kesalahan. Silakan coba lagi.', 'error');
            }
        });
    }
});

// Show message function
function showMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    const messageContent = messageEl.querySelector('.message-content');
    messageContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
    `;
    
    const closeBtn = messageEl.querySelector('.message-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: 15px;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageContent.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            break;
        case 'error':
            messageContent.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
            break;
        case 'warning':
            messageContent.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
            break;
        default:
            messageContent.style.background = 'linear-gradient(135deg, #17a2b8, #6f42c1)';
    }
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(messageEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Utility functions for password strength
function checkPasswordStrength(password) {
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
        if (check) strength++;
    });
    
    return {
        score: strength,
        checks: checks,
        level: strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong'
    };
}

// Server API authentication functions
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return; // Stay on login page
    }
    
    try {
        const response = await fetch('/api/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const user = await response.json();
            // User is logged in, redirect to dashboard
            window.location.href = 'index.html';
        } else {
            // Invalid token, remove it
            localStorage.removeItem('authToken');
        }
    } catch (error) {
        console.log('Auth check failed:', error);
        localStorage.removeItem('authToken');
    }
}

async function loginUser(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Store token and user info
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            showMessage('Login berhasil! Mengalihkan...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage(data.error || 'Username atau password salah', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Terjadi kesalahan saat login. Silakan coba lagi.', 'error');
    }
}