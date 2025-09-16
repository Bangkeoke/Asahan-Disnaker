// API Client for MySQL Backend
class APIClient {
    constructor() {
        this.baseURL = window.location.origin;
        this.token = localStorage.getItem('authToken');
    }

    // Helper method for API calls
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Network error' }));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(username, password) {
        const response = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        
        return response;
    }

    async register(userData) {
        return await this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn() {
        return !!this.token && !!this.getCurrentUser();
    }

    // User methods
    async getUsers() {
        return await this.request('/users');
    }

    // Letter methods
    async getLetters(type = null, status = null, priority = null) {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        
        const queryString = params.toString();
        return await this.request(`/letters${queryString ? '?' + queryString : ''}`);
    }

    async getLetterById(id) {
        return await this.request(`/letters/${id}`);
    }

    async createLetter(letterData) {
        return await this.request('/letters', {
            method: 'POST',
            body: JSON.stringify(letterData)
        });
    }

    async updateLetter(id, letterData) {
        return await this.request(`/letters/${id}`, {
            method: 'PUT',
            body: JSON.stringify(letterData)
        });
    }

    async deleteLetter(id) {
        return await this.request(`/letters/${id}`, {
            method: 'DELETE'
        });
    }

    // Disposition methods
    async createDisposition(letterId, dispositionData) {
        return await this.request(`/letters/${letterId}/dispositions`, {
            method: 'POST',
            body: JSON.stringify(dispositionData)
        });
    }

    // Archive methods
    async getArchivedLetters(type = null, year = null) {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (year) params.append('year', year);
        
        const queryString = params.toString();
        return await this.request(`/archived-letters${queryString ? '?' + queryString : ''}`);
    }

    async archiveLetter(id) {
        return await this.request(`/letters/${id}/archive`, {
            method: 'POST'
        });
    }

    async restoreFromArchive(id) {
        return await this.request(`/archived-letters/${id}/restore`, {
            method: 'POST'
        });
    }

    async deleteFromArchive(id) {
        return await this.request(`/archived-letters/${id}`, {
            method: 'DELETE'
        });
    }

    // Statistics
    async getStatistics() {
        return await this.request('/statistics');
    }

    // Search
    async searchLetters(query, type = null, status = null, priority = null) {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (type) params.append('type', type);
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        
        const queryString = params.toString();
        return await this.request(`/search${queryString ? '?' + queryString : ''}`);
    }

    async searchArchivedLetters(query, type = null, year = null) {
        const archivedLetters = await this.getArchivedLetters(type, year);
        
        if (!query) return archivedLetters;
        
        const queryLower = query.toLowerCase();
        return archivedLetters.filter(letter => 
            letter.subject.toLowerCase().includes(queryLower) ||
            letter.sender.toLowerCase().includes(queryLower) ||
            letter.recipient.toLowerCase().includes(queryLower) ||
            (letter.letter_number && letter.letter_number.toLowerCase().includes(queryLower)) ||
            letter.content.toLowerCase().includes(queryLower)
        );
    }
}

// Initialize API client
const apiClient = new APIClient();

// Database compatibility layer - adapts API client to work with existing frontend code
class DatabaseAdapter {
    constructor() {
        this.api = apiClient;
    }

    // User management
    getUsers() {
        return this.api.getUsers();
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    async createUser(userData) {
        return await this.api.register(userData);
    }

    async deleteUser(id) {
        // Implementation would need to be added to backend
        throw new Error('Delete user not implemented');
    }

    // Authentication
    async login(username, password) {
        try {
            const response = await this.api.login(username, password);
            return response.user;
        } catch (error) {
            return null;
        }
    }

    logout() {
        this.api.logout();
    }

    getCurrentUser() {
        return this.api.getCurrentUser();
    }

    isLoggedIn() {
        return this.api.isLoggedIn();
    }

    // Letter management
    async getLetters(type = null) {
        return await this.api.getLetters(type);
    }

    async getLetterById(id) {
        return await this.api.getLetterById(id);
    }

    async createLetter(letterData) {
        const response = await this.api.createLetter(letterData);
        // Return the created letter with ID
        return { id: response.letterId, ...letterData };
    }

    async updateLetter(id, letterData) {
        await this.api.updateLetter(id, letterData);
        return { id, ...letterData };
    }

    async deleteLetter(id) {
        await this.api.deleteLetter(id);
        return true;
    }

    // Archive management
    async getArchivedLetters() {
        return await this.api.getArchivedLetters();
    }

    async getArchivedLetterById(id) {
        const archivedLetters = await this.getArchivedLetters();
        return archivedLetters.find(letter => letter.id === id);
    }

    async archiveLetter(id) {
        await this.api.archiveLetter(id);
        return true;
    }

    async restoreFromArchive(id) {
        await this.api.restoreFromArchive(id);
        return true;
    }

    async deleteFromArchive(id) {
        await this.api.deleteFromArchive(id);
        return true;
    }

    async searchArchivedLetters(query, type = null, year = null) {
        return await this.api.searchArchivedLetters(query, type, year);
    }

    // Search and filter
    async searchLetters(query, type = null, status = null, priority = null) {
        return await this.api.searchLetters(query, type, status, priority);
    }

    // Statistics
    async getStatistics() {
        const stats = await this.api.getStatistics();
        return {
            totalLetters: stats.total_letters,
            incomingLetters: stats.incoming_letters,
            outgoingLetters: stats.outgoing_letters,
            pendingLetters: stats.pending_letters,
            thisMonthIncoming: stats.this_month_incoming,
            thisMonthOutgoing: stats.this_month_outgoing,
            archivedLetters: stats.archived_letters
        };
    }
}

// Replace the existing db object
const db = new DatabaseAdapter();