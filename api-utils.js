// API utility functions for authenticated requests
class ApiUtils {
    static getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }

    static getAuthHeadersForFormData() {
        const token = localStorage.getItem('authToken');
        return token ? {
            'Authorization': `Bearer ${token}`
        } : {};
    }

    static async fetchWithAuth(url, options = {}) {
        const headers = options.body instanceof FormData 
            ? this.getAuthHeadersForFormData()
            : this.getAuthHeaders();

        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        });

        // Handle unauthorized responses
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
            throw new Error('Session expired. Please login again.');
        }

        return response;
    }

    static async logout() {
        try {
            await this.fetchWithAuth('/api/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }

    static showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;

        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };

        messageEl.style.backgroundColor = colors[type] || colors.info;
        messageEl.textContent = message;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => messageEl.remove(), 300);
        }, 4000);
    }
}

// Make ApiUtils available globally
window.ApiUtils = ApiUtils;

// Global logout function
window.logout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        ApiUtils.logout();
    }
};