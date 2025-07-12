// Admin Dashboard JavaScript
let adminToken = localStorage.getItem('adminToken');
let currentTab = 'overview';

// Check authentication on load
document.addEventListener('DOMContentLoaded', function() {
    if (adminToken) {
        verifyAdminToken();
    } else {
        showLoginModal();
    }
});

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            adminToken = data.token;
            localStorage.setItem('adminToken', adminToken);
            hideLoginModal();
            loadDashboard();
        } else {
            alert('Invalid credentials. Use admin@packyourbags.com / admin123');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function verifyAdminToken() {
    try {
        const response = await fetch('/api/admin/verify', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            hideLoginModal();
            loadDashboard();
        } else {
            localStorage.removeItem('adminToken');
            showLoginModal();
        }
    } catch (error) {
        localStorage.removeItem('adminToken');
        showLoginModal();
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    adminToken = null;
    showLoginModal();
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = 'tab-btn px-6 py-3 font-semibold text-gray-600 hover:text-blue-600 transition';
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.remove('hidden');
    
    // Add active class to clicked button
    event.target.className = 'tab-btn px-6 py-3 font-semibold border-b-2 border-blue-500 text-blue-600';
    
    currentTab = tabName;
    loadTabData(tabName);
}

async function loadDashboard() {
    loadTabData('overview');
}

async function loadTabData(tabName) {
    switch(tabName) {
        case 'overview':
            await loadOverviewData();
            break;
        case 'users':
            await loadUsersData();
            break;
        case 'bookings':
            await loadBookingsData();
            break;
        case 'revenue':
            await loadRevenueData();
            break;
        case 'database':
            await loadDatabaseData();
            break;
    }
}

async function loadOverviewData() {
    try {
        const [stats, activity] = await Promise.all([
            fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${adminToken}` } }),
            fetch('/api/admin/activity', { headers: { 'Authorization': `Bearer ${adminToken}` } })
        ]);

        const statsData = await stats.json();
        const activityData = await activity.json();

        // Update statistics
        document.getElementById('totalUsers').textContent = statsData.totalUsers || 0;
        document.getElementById('totalGuides').textContent = statsData.totalGuides || 0;
        document.getElementById('totalBookings').textContent = statsData.totalBookings || 0;
        document.getElementById('totalRevenue').textContent = `$${statsData.totalRevenue || 0}`;

        // Load charts
        loadUserGrowthChart();
        loadRevenueChart();

        // Load recent activity
        loadRecentActivity(activityData);
    } catch (error) {
        console.error('Error loading overview data:', error);
    }
}

async function loadUsersData() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const users = await response.json();
        
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = users.map(user => `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-3">${user.name || user.username}</td>
                <td class="py-3">${user.email}</td>
                <td class="py-3">
                    <span class="px-2 py-1 rounded-full text-xs ${user.role === 'guide' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                        ${user.role || 'user'}
                    </span>
                </td>
                <td class="py-3">${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="py-3">
                    <span class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span>
                </td>
                <td class="py-3">
                    <button onclick="viewUser(${user.id})" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editUser(${user.id})" class="text-yellow-600 hover:text-yellow-800">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users data:', error);
    }
}

async function loadBookingsData() {
    try {
        const response = await fetch('/api/admin/bookings', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const bookings = await response.json();
        
        // Update booking statistics
        const pending = bookings.filter(b => b.status === 'pending').length;
        const confirmed = bookings.filter(b => b.status === 'accepted').length;
        const completed = bookings.filter(b => b.status === 'completed').length;
        
        document.getElementById('pendingBookings').textContent = pending;
        document.getElementById('confirmedBookings').textContent = confirmed;
        document.getElementById('completedBookings').textContent = completed;
        
        const tbody = document.getElementById('bookingsTableBody');
        tbody.innerHTML = bookings.map(booking => `
            <tr class="border-b hover:bg-gray-50">
                <td class="py-3">#${booking.id}</td>
                <td class="py-3">${booking.userName || 'N/A'}</td>
                <td class="py-3">${booking.guideName || 'N/A'}</td>
                <td class="py-3">${booking.destination}</td>
                <td class="py-3">${booking.date}</td>
                <td class="py-3">
                    <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}">
                        ${booking.status}
                    </span>
                </td>
                <td class="py-3">$${booking.totalAmount || 'TBD'}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading bookings data:', error);
    }
}

async function loadRevenueData() {
    try {
        const response = await fetch('/api/admin/revenue', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const revenueData = await response.json();
        
        loadRevenueByServiceChart(revenueData);
        loadMonthlyRevenueChart(revenueData);
        loadRevenueBreakdown(revenueData);
    } catch (error) {
        console.error('Error loading revenue data:', error);
    }
}

async function loadDatabaseData() {
    try {
        const response = await fetch('/api/admin/database/tables', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const tables = await response.json();
        
        const container = document.getElementById('databaseTables');
        container.innerHTML = tables.map(table => `
            <div class="flex justify-between items-center p-3 border rounded-lg">
                <span class="font-mono text-sm">${table.table_name}</span>
                <button onclick="viewTable('${table.table_name}')" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-table mr-1"></i>View
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading database data:', error);
    }
}

function loadUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Users',
                data: [12, 19, 15, 25, 32, 28],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function loadRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [1200, 1900, 1500, 2500, 3200, 2800],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function loadRevenueByServiceChart(data) {
    const ctx = document.getElementById('revenueByServiceChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Guide Services', 'Hotel Bookings', 'Transportation', 'Tours'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadMonthlyRevenueChart(data) {
    const ctx = document.getElementById('monthlyRevenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [5000, 7500, 6200, 8900, 11200, 9800],
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function loadRecentActivity(activities) {
    const container = document.getElementById('recentActivity');
    container.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
            <i class="fas ${getActivityIcon(activity.type)} text-blue-600"></i>
            <div>
                <p class="text-sm font-medium">${activity.message}</p>
                <p class="text-xs text-gray-500">${formatTime(activity.timestamp)}</p>
            </div>
        </div>
    `).join('');
}

function loadRevenueBreakdown(data) {
    const container = document.getElementById('revenueBreakdown');
    const breakdown = [
        { title: 'Guide Services', amount: 45000, percentage: 45, color: 'blue' },
        { title: 'Hotel Bookings', amount: 25000, percentage: 25, color: 'green' },
        { title: 'Transportation', amount: 20000, percentage: 20, color: 'yellow' }
    ];
    
    container.innerHTML = breakdown.map(item => `
        <div class="p-4 border rounded-lg">
            <h4 class="font-semibold text-${item.color}-600">${item.title}</h4>
            <p class="text-2xl font-bold">$${item.amount.toLocaleString()}</p>
            <p class="text-sm text-gray-600">${item.percentage}% of total</p>
        </div>
    `).join('');
}

async function executeSqlQuery() {
    const query = document.getElementById('sqlQuery').value.trim();
    if (!query) {
        alert('Please enter a SQL query');
        return;
    }

    try {
        const response = await fetch('/api/admin/database/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        
        document.getElementById('queryResults').classList.remove('hidden');
        document.getElementById('queryOutput').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Query execution error:', error);
        document.getElementById('queryResults').classList.remove('hidden');
        document.getElementById('queryOutput').textContent = 'Error: ' + error.message;
    }
}

async function viewTable(tableName) {
    const query = `SELECT * FROM ${tableName} LIMIT 100`;
    document.getElementById('sqlQuery').value = query;
    await executeSqlQuery();
}

function filterUsers(role) {
    // Update filter button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm';
    });
    event.target.className = 'filter-btn px-4 py-2 bg-blue-500 text-white rounded-lg text-sm';
    
    // Filter table rows
    const rows = document.querySelectorAll('#usersTableBody tr');
    rows.forEach(row => {
        const roleCell = row.cells[2].textContent.trim().toLowerCase();
        if (role === 'all' || roleCell === role) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function viewUser(userId) {
    alert(`View user details for ID: ${userId}`);
}

function editUser(userId) {
    alert(`Edit user for ID: ${userId}`);
}

function getStatusColor(status) {
    switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function getActivityIcon(type) {
    switch(type) {
        case 'user_registration': return 'fa-user-plus';
        case 'booking_created': return 'fa-calendar-plus';
        case 'payment_completed': return 'fa-credit-card';
        case 'guide_registration': return 'fa-map-marked-alt';
        default: return 'fa-bell';
    }
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString();
}