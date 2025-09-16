// Letter form handling with file upload
class LetterHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupFileUpload();
        this.setupFormSubmission();
    }

    setupFileUpload() {
        const attachmentInput = document.getElementById('attachment');
        const removeButton = document.getElementById('removeAttachment');
        
        if (attachmentInput) {
            attachmentInput.addEventListener('change', (e) => {
                this.handleFileSelect(e.target.files[0]);
            });
        }

        if (removeButton) {
            removeButton.addEventListener('click', () => {
                this.removeAttachment();
            });
        }
    }

    handleFileSelect(file) {
        if (!file) return;

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showMessage('File terlalu besar. Maksimal 10MB.', 'error');
            this.clearFileInput();
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            this.showMessage('Format file tidak didukung. Gunakan JPG, PNG, PDF, DOC, atau DOCX.', 'error');
            this.clearFileInput();
            return;
        }

        this.showFilePreview(file);
    }

    showFilePreview(file) {
        const preview = document.getElementById('attachmentPreview');
        const icon = document.getElementById('attachmentIcon');
        const name = document.getElementById('attachmentName');
        const size = document.getElementById('attachmentSize');

        if (preview && icon && name && size) {
            // Set appropriate icon based on file type
            if (file.type.startsWith('image/')) {
                icon.textContent = '🖼️';
            } else if (file.type === 'application/pdf') {
                icon.textContent = '📄';
            } else if (file.type.includes('word')) {
                icon.textContent = '📝';
            } else {
                icon.textContent = '📎';
            }

            name.textContent = file.name;
            size.textContent = this.formatFileSize(file.size);
            preview.style.display = 'block';
        }
    }

    removeAttachment() {
        this.clearFileInput();
        const preview = document.getElementById('attachmentPreview');
        if (preview) {
            preview.style.display = 'none';
        }
    }

    clearFileInput() {
        const attachmentInput = document.getElementById('attachment');
        if (attachmentInput) {
            attachmentInput.value = '';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupFormSubmission() {
        const letterForm = document.getElementById('letterForm');
        if (letterForm) {
            // Remove existing event listeners to avoid conflicts
            letterForm.replaceWith(letterForm.cloneNode(true));
            
            // Re-get the form reference after cloning
            const newLetterForm = document.getElementById('letterForm');
            
            newLetterForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFormSubmit();
            });
        }
    }

    async handleFormSubmit() {
        const modal = document.getElementById('createModal');
        const letterType = modal?.dataset.letterType || 'outgoing';
        const letterId = modal?.dataset.letterId;

        // Create FormData to handle file upload
        const formData = new FormData();
        
        // Add form fields
        formData.append('type', letterType);
        formData.append('subject', document.getElementById('subject')?.value || '');
        formData.append('sender', document.getElementById('sender')?.value || '');
        formData.append('recipient', document.getElementById('recipient')?.value || '');
        formData.append('letterNumber', document.getElementById('letterNumber')?.value || '');
        formData.append('priority', document.getElementById('priority')?.value || 'sedang');
        formData.append('content', document.getElementById('content')?.value || '');
        formData.append('status', 'draft');

        // Add file if selected
        const attachmentInput = document.getElementById('attachment');
        if (attachmentInput && attachmentInput.files[0]) {
            formData.append('attachment', attachmentInput.files[0]);
        }

        // Show loading state
        const btnText = document.querySelector('.btn-text');
        const loading = document.querySelector('.loading');
        
        if (btnText && loading) {
            btnText.style.display = 'none';
            loading.style.display = 'flex';
        }

        try {
            let response;
            if (letterId) {
                // Update existing letter
                response = await ApiUtils.fetchWithAuth(`/api/letters/${letterId}`, {
                    method: 'PUT',
                    body: formData
                });
            } else {
                // Create new letter
                response = await ApiUtils.fetchWithAuth('/api/letters', {
                    method: 'POST',
                    body: formData
                });
            }

            const data = await response.json();

            if (response.ok) {
                this.showMessage(letterId ? '✅ Surat berhasil diperbarui!' : '✅ Surat berhasil dibuat!', 'success');
                this.closeModal();
                
                // Reload letters list if on letters page
                this.reloadLettersList(letterType);
                
                // Reload dashboard stats
                this.loadDashboardStats();
            } else {
                this.showMessage(data.error || 'Gagal menyimpan surat', 'error');
            }
        } catch (error) {
            console.error('Error submitting letter:', error);
            this.showMessage('Terjadi kesalahan saat menyimpan surat', 'error');
        } finally {
            // Hide loading state
            if (btnText && loading) {
                btnText.style.display = 'inline';
                loading.style.display = 'none';
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('createModal');
        const form = document.getElementById('letterForm');
        
        if (modal) modal.classList.remove('show');
        if (form) form.reset();
        
        // Clear file preview
        this.removeAttachment();
    }

    async reloadLettersList(letterType) {
        try {
            const response = await ApiUtils.fetchWithAuth(`/api/letters?type=${letterType}`);
            if (response.ok) {
                const letters = await response.json();
                this.updateLettersDisplay(letters, letterType);
            }
        } catch (error) {
            console.error('Error reloading letters:', error);
        }
    }

    updateLettersDisplay(letters, type) {
        const containerId = type === 'incoming' ? 'incomingLettersList' : 'outgoingLettersList';
        const container = document.getElementById(containerId);
        
        if (!container) return;

        if (letters.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: rgba(255, 255, 255, 0.7);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${type === 'incoming' ? '📥' : '📤'}</div>
                    <h3>Belum ada ${type === 'incoming' ? 'surat masuk' : 'surat keluar'}</h3>
                    <p>Klik tombol tambah untuk membuat surat baru</p>
                </div>
            `;
            return;
        }

        container.innerHTML = letters.map(letter => `
            <div class="letter-item">
                <div class="letter-header">
                    <div class="letter-meta">
                        <span class="letter-number">${letter.letterNumber || 'No Number'}</span>
                        <span class="letter-priority priority-${letter.priority}">${this.getPriorityText(letter.priority)}</span>
                        <span class="letter-status status-${letter.status}">${this.getStatusText(letter.status)}</span>
                    </div>
                    <div class="letter-date">${this.formatDate(letter.createdAt)}</div>
                </div>
                <div class="letter-content">
                    <h4 class="letter-subject">${letter.subject}</h4>
                    <div class="letter-details">
                        <div><strong>Dari:</strong> ${letter.sender}</div>
                        <div><strong>Kepada:</strong> ${letter.recipient}</div>
                        ${letter.attachment ? `<div><strong>Lampiran:</strong> 📎 ${letter.attachment.originalName}</div>` : ''}
                    </div>
                </div>
                <div class="letter-actions">
                    <button class="btn btn-primary" onclick="viewLetter(${letter.id})" title="Lihat detail">
                        👁️ Lihat
                    </button>
                    <button class="btn btn-secondary" onclick="editLetter(${letter.id})" title="Edit surat">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-warning" onclick="archiveLetter(${letter.id})" title="Arsipkan">
                        🗂️ Arsip
                    </button>
                    <button class="btn btn-danger" onclick="deleteLetter(${letter.id})" title="Hapus surat">
                        🗑️ Hapus
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadDashboardStats() {
        try {
            const response = await ApiUtils.fetchWithAuth('/api/statistics');
            if (response.ok) {
                const stats = await response.json();
                this.updateDashboardStats(stats);
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    updateDashboardStats(stats) {
        const elements = {
            'incomingCount': stats.totalIncoming,
            'outgoingCount': stats.totalOutgoing,
            'pendingCount': stats.pendingLetters,
            'archivedCount': stats.archivedLetters
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    getPriorityText(priority) {
        const priorities = {
            'rendah': 'Rendah',
            'sedang': 'Sedang', 
            'tinggi': 'Tinggi'
        };
        return priorities[priority] || priority;
    }

    getStatusText(status) {
        const statuses = {
            'draft': 'Draft',
            'pending': 'Pending',
            'diterima': 'Diterima',
            'disetujui': 'Disetujui',
            'ditolak': 'Ditolak',
            'dikirim': 'Dikirim',
            'disposisi': 'Disposisi'
        };
        return statuses[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showMessage(message, type = 'info') {
        ApiUtils.showMessage(message, type);
    }
}

// Initialize letter handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.letterHandler = new LetterHandler();
});

// Global function for modal actions
window.closeModal = () => {
    if (window.letterHandler) {
        window.letterHandler.closeModal();
    }
};