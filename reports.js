// Reports Module - Complete Implementation
class ReportsManager {
    constructor() {
        this.charts = {};
        this.currentFilters = {
            dateRange: 'thisMonth',
            type: 'all',
            status: 'all',
            priority: 'all'
        };
    }

    // Initialize reports page
    initializeReports() {
        this.loadReportsData();
        this.setupReportFilters();
        this.createCharts();
        this.generateStatistics();
    }

    // Load reports data
    loadReportsData() {
        const letters = db.getLetters();
        const archivedLetters = db.getArchivedLetters();
        const users = db.getUsers();
        
        this.reportsData = {
            letters: letters,
            archivedLetters: archivedLetters,
            users: users,
            totalLetters: letters.length + archivedLetters.length,
            thisMonth: this.getThisMonthData(letters),
            lastMonth: this.getLastMonthData(letters)
        };
    }

    // Get this month data
    getThisMonthData(letters) {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return letters.filter(letter => {
            const letterDate = new Date(letter.createdAt);
            return letterDate >= thisMonth;
        });
    }

    // Get last month data
    getLastMonthData(letters) {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return letters.filter(letter => {
            const letterDate = new Date(letter.createdAt);
            return letterDate >= lastMonth && letterDate < thisMonth;
        });
    }

    // Setup report filters
    setupReportFilters() {
        const dateRangeFilter = document.getElementById('reportDateRange');
        const typeFilter = document.getElementById('reportTypeFilter');
        const statusFilter = document.getElementById('reportStatusFilter');
        const priorityFilter = document.getElementById('reportPriorityFilter');

        if (dateRangeFilter) {
            dateRangeFilter.addEventListener('change', () => {
                this.currentFilters.dateRange = dateRangeFilter.value;
                this.updateReports();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.currentFilters.type = typeFilter.value;
                this.updateReports();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.currentFilters.status = statusFilter.value;
                this.updateReports();
            });
        }

        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => {
                this.currentFilters.priority = priorityFilter.value;
                this.updateReports();
            });
        }
    }

    // Update reports based on filters
    updateReports() {
        this.loadReportsData();
        this.createCharts();
        this.generateStatistics();
    }

    // Generate statistics
    generateStatistics() {
        const filteredData = this.getFilteredData();
        
        // Update summary cards
        this.updateSummaryCards(filteredData);
        
        // Update detailed statistics
        this.updateDetailedStats(filteredData);
        
        // Update trends
        this.updateTrends(filteredData);
    }

    // Get filtered data based on current filters
    getFilteredData() {
        let data = [...this.reportsData.letters, ...this.reportsData.archivedLetters];
        
        // Apply date range filter
        if (this.currentFilters.dateRange !== 'all') {
            data = this.filterByDateRange(data, this.currentFilters.dateRange);
        }
        
        // Apply type filter
        if (this.currentFilters.type !== 'all') {
            data = data.filter(letter => letter.type === this.currentFilters.type);
        }
        
        // Apply status filter
        if (this.currentFilters.status !== 'all') {
            data = data.filter(letter => letter.status === this.currentFilters.status);
        }
        
        // Apply priority filter
        if (this.currentFilters.priority !== 'all') {
            data = data.filter(letter => letter.priority === this.currentFilters.priority);
        }
        
        return data;
    }

    // Filter by date range
    filterByDateRange(data, range) {
        const now = new Date();
        let startDate;
        
        switch (range) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'thisWeek':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                break;
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'thisYear':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return data;
        }
        
        return data.filter(letter => {
            const letterDate = new Date(letter.createdAt);
            return letterDate >= startDate;
        });
    }

    // Update summary cards
    updateSummaryCards(data) {
        const totalLetters = data.length;
        const incomingLetters = data.filter(l => l.type === 'incoming').length;
        const outgoingLetters = data.filter(l => l.type === 'outgoing').length;
        const pendingLetters = data.filter(l => ['draft', 'diterima', 'menunggu_persetujuan'].includes(l.status)).length;
        
        // Update DOM elements
        const totalEl = document.getElementById('reportTotalLetters');
        const incomingEl = document.getElementById('reportIncomingLetters');
        const outgoingEl = document.getElementById('reportOutgoingLetters');
        const pendingEl = document.getElementById('reportPendingLetters');
        
        if (totalEl) totalEl.textContent = totalLetters;
        if (incomingEl) incomingEl.textContent = incomingLetters;
        if (outgoingEl) outgoingEl.textContent = outgoingLetters;
        if (pendingEl) pendingEl.textContent = pendingLetters;
    }

    // Update detailed statistics
    updateDetailedStats(data) {
        const stats = {
            byStatus: this.groupByField(data, 'status'),
            byPriority: this.groupByField(data, 'priority'),
            byType: this.groupByField(data, 'type'),
            byMonth: this.groupByMonth(data)
        };
        
        this.displayDetailedStats(stats);
    }

    // Group data by field
    groupByField(data, field) {
        return data.reduce((acc, item) => {
            const key = item[field] || 'unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
    }

    // Group data by month
    groupByMonth(data) {
        return data.reduce((acc, item) => {
            const date = new Date(item.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});
    }

    // Display detailed statistics
    displayDetailedStats(stats) {
        const statsContainer = document.getElementById('detailedStats');
        if (!statsContainer) return;
        
        statsContainer.innerHTML = `
            <div class="stats-section">
                <h4>📊 Statistik Berdasarkan Status</h4>
                <div class="stats-grid">
                    ${Object.entries(stats.byStatus).map(([status, count]) => `
                        <div class="stat-item">
                            <span class="stat-label">${this.getStatusText(status)}</span>
                            <span class="stat-value">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="stats-section">
                <h4>⚡ Statistik Berdasarkan Prioritas</h4>
                <div class="stats-grid">
                    ${Object.entries(stats.byPriority).map(([priority, count]) => `
                        <div class="stat-item">
                            <span class="stat-label">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                            <span class="stat-value">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="stats-section">
                <h4>📈 Tren Bulanan</h4>
                <div class="monthly-trend">
                    ${Object.entries(stats.byMonth).sort().map(([month, count]) => `
                        <div class="trend-item">
                            <span class="trend-month">${this.formatMonth(month)}</span>
                            <div class="trend-bar">
                                <div class="trend-fill" style="width: ${(count / Math.max(...Object.values(stats.byMonth))) * 100}%"></div>
                            </div>
                            <span class="trend-count">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Create charts (simplified version without external libraries)
    createCharts() {
        this.createStatusChart();
        this.createTrendChart();
        this.createPriorityChart();
    }

    // Create status chart
    createStatusChart() {
        const data = this.getFilteredData();
        const statusData = this.groupByField(data, 'status');
        const chartContainer = document.getElementById('statusChart');
        
        if (!chartContainer) return;
        
        const total = Object.values(statusData).reduce((sum, count) => sum + count, 0);
        
        chartContainer.innerHTML = `
            <div class="chart-title">Distribusi Status Surat</div>
            <div class="pie-chart">
                ${Object.entries(statusData).map(([status, count]) => {
                    const percentage = ((count / total) * 100).toFixed(1);
                    return `
                        <div class="pie-segment" style="--percentage: ${percentage}%">
                            <span class="pie-label">${this.getStatusText(status)}: ${count} (${percentage}%)</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Create trend chart
    createTrendChart() {
        const data = this.getFilteredData();
        const monthlyData = this.groupByMonth(data);
        const chartContainer = document.getElementById('trendChart');
        
        if (!chartContainer) return;
        
        const sortedMonths = Object.keys(monthlyData).sort();
        const maxCount = Math.max(...Object.values(monthlyData));
        
        chartContainer.innerHTML = `
            <div class="chart-title">Tren Surat Bulanan</div>
            <div class="line-chart">
                ${sortedMonths.map(month => {
                    const count = monthlyData[month];
                    const height = (count / maxCount) * 100;
                    return `
                        <div class="chart-bar">
                            <div class="bar-fill" style="height: ${height}%"></div>
                            <div class="bar-label">${this.formatMonth(month)}</div>
                            <div class="bar-value">${count}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Create priority chart
    createPriorityChart() {
        const data = this.getFilteredData();
        const priorityData = this.groupByField(data, 'priority');
        const chartContainer = document.getElementById('priorityChart');
        
        if (!chartContainer) return;
        
        const priorities = ['tinggi', 'sedang', 'rendah'];
        const colors = ['#dc3545', '#ffc107', '#28a745'];
        
        chartContainer.innerHTML = `
            <div class="chart-title">Distribusi Prioritas Surat</div>
            <div class="bar-chart">
                ${priorities.map((priority, index) => {
                    const count = priorityData[priority] || 0;
                    const total = Object.values(priorityData).reduce((sum, c) => sum + c, 0);
                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                    return `
                        <div class="priority-bar">
                            <div class="priority-label">${priority.charAt(0).toUpperCase() + priority.slice(1)}</div>
                            <div class="priority-progress">
                                <div class="priority-fill" style="width: ${percentage}%; background-color: ${colors[index]}"></div>
                            </div>
                            <div class="priority-count">${count} (${percentage}%)</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Update trends
    updateTrends(data) {
        const thisMonthCount = this.getThisMonthData(data).length;
        const lastMonthCount = this.getLastMonthData(data).length;
        
        const trend = thisMonthCount - lastMonthCount;
        const trendPercentage = lastMonthCount > 0 ? ((trend / lastMonthCount) * 100).toFixed(1) : 0;
        
        const trendEl = document.getElementById('monthlyTrend');
        if (trendEl) {
            const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
            const trendColor = trend > 0 ? 'success' : trend < 0 ? 'danger' : 'info';
            
            trendEl.innerHTML = `
                <span class="trend-icon">${trendIcon}</span>
                <span class="trend-text ${trendColor}">
                    ${Math.abs(trend)} surat ${trend > 0 ? 'lebih banyak' : trend < 0 ? 'lebih sedikit' : 'sama'} 
                    dari bulan lalu (${trendPercentage}%)
                </span>
            `;
        }
    }

    // Export reports
    exportReport(format) {
        const data = this.getFilteredData();
        const timestamp = new Date().toISOString().split('T')[0];
        
        switch (format) {
            case 'json':
                this.exportJSON(data, timestamp);
                break;
            case 'csv':
                this.exportCSV(data, timestamp);
                break;
            case 'pdf':
                this.exportPDF(data, timestamp);
                break;
        }
    }

    // Export as JSON
    exportJSON(data, timestamp) {
        const reportData = {
            generatedAt: new Date().toISOString(),
            filters: this.currentFilters,
            summary: {
                total: data.length,
                incoming: data.filter(l => l.type === 'incoming').length,
                outgoing: data.filter(l => l.type === 'outgoing').length,
                byStatus: this.groupByField(data, 'status'),
                byPriority: this.groupByField(data, 'priority')
            },
            data: data.map(letter => ({
                id: letter.id,
                type: letter.type,
                subject: letter.subject,
                sender: letter.sender,
                recipient: letter.recipient,
                status: letter.status,
                priority: letter.priority,
                createdAt: letter.createdAt
            }))
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, `laporan-surat-${timestamp}.json`);
    }

    // Export as CSV
    exportCSV(data, timestamp) {
        const headers = ['ID', 'Jenis', 'Subjek', 'Pengirim', 'Penerima', 'Status', 'Prioritas', 'Tanggal Dibuat'];
        const rows = data.map(letter => [
            letter.id,
            letter.type === 'incoming' ? 'Masuk' : 'Keluar',
            letter.subject,
            letter.sender || '',
            letter.recipient || '',
            this.getStatusText(letter.status),
            letter.priority,
            new Date(letter.createdAt).toLocaleDateString('id-ID')
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, `laporan-surat-${timestamp}.csv`);
    }

    // Export as PDF (simplified HTML version)
    exportPDF(data, timestamp) {
        const stats = {
            total: data.length,
            incoming: data.filter(l => l.type === 'incoming').length,
            outgoing: data.filter(l => l.type === 'outgoing').length,
            byStatus: this.groupByField(data, 'status'),
            byPriority: this.groupByField(data, 'priority')
        };
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Laporan Surat - ${timestamp}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
                    .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                    .table { width: 100%; border-collapse: collapse; }
                    .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .table th { background-color: #f5f5f5; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Laporan Sistem Pengelolaan Surat</h1>
                    <h2>Dinas Ketenagakerjaan Kabupaten Asahan</h2>
                    <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
                </div>
                
                <div class="summary">
                    <div class="summary-card">
                        <h3>Total Surat</h3>
                        <p style="font-size: 2em; margin: 0;">${stats.total}</p>
                    </div>
                    <div class="summary-card">
                        <h3>Surat Masuk</h3>
                        <p style="font-size: 2em; margin: 0;">${stats.incoming}</p>
                    </div>
                    <div class="summary-card">
                        <h3>Surat Keluar</h3>
                        <p style="font-size: 2em; margin: 0;">${stats.outgoing}</p>
                    </div>
                </div>
                
                <h3>Detail Surat</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Jenis</th>
                            <th>Subjek</th>
                            <th>Status</th>
                            <th>Prioritas</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((letter, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${letter.type === 'incoming' ? 'Masuk' : 'Keluar'}</td>
                                <td>${letter.subject}</td>
                                <td>${this.getStatusText(letter.status)}</td>
                                <td>${letter.priority}</td>
                                <td>${new Date(letter.createdAt).toLocaleDateString('id-ID')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        this.downloadFile(blob, `laporan-surat-${timestamp}.html`);
    }

    // Download file helper
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showMessage(`Laporan berhasil diekspor: ${filename}`, 'success');
    }

    // Helper methods
    getStatusText(status) {
        const statusMap = {
            'draft': 'Draft',
            'diterima': 'Diterima',
            'menunggu_persetujuan': 'Menunggu Persetujuan',
            'disetujui': 'Disetujui',
            'ditolak': 'Ditolak',
            'disposisi': 'Disposisi',
            'selesai': 'Selesai',
            'dikirim': 'Dikirim',
            'archived': 'Diarsipkan'
        };
        return statusMap[status] || status;
    }

    formatMonth(monthKey) {
        const [year, month] = monthKey.split('-');
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
}

// Initialize reports manager
window.reportsManager = new ReportsManager();

// Export functions for global access
window.exportReport = (format) => window.reportsManager.exportReport(format);
window.resetReportFilters = () => {
    document.getElementById('reportDateRange').value = 'thisMonth';
    document.getElementById('reportTypeFilter').value = 'all';
    document.getElementById('reportStatusFilter').value = 'all';
    document.getElementById('reportPriorityFilter').value = 'all';
    window.reportsManager.currentFilters = {
        dateRange: 'thisMonth',
        type: 'all',
        status: 'all',
        priority: 'all'
    };
    window.reportsManager.updateReports();
};