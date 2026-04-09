const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Session middleware for admin auth
app.use(session({
  secret: 'demo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 } // 1 hour for demo
}));

// In-memory data storage
const farmers = [];
const schemes = [
  { id: 1, title: 'PM-KISAN', description: 'Direct income support ₹6000/year', category: 'Subsidy', state: 'All India', deadline: '2026-03-31', active: true },
  { id: 2, title: 'PM Fasal Bima Yojana', description: 'Crop insurance coverage', category: 'Insurance', state: 'All India', deadline: '2026-06-30', active: true },
  { id: 3, title: 'PM Krishi Sinchayee Yojana', description: 'Micro irrigation subsidy', category: 'Irrigation', state: 'All India', deadline: '2026-12-31', active: true }
];
const applications = [];
let farmerIdCounter = 1;

// Translations
const translations = {
  en: {
    title: "Farmer Scheme Portal",
    admin: "Admin Dashboard",
    login: "Login",
    logout: "Logout",
    farmers: "Farmers",
    schemes: "Schemes",
    applications: "Applications",
    notifications: "Notifications",
    reports: "Reports",
    settings: "Settings",
    quickStats: "Quick Stats",
    totalFarmers: "Total Farmers",
    totalSchemes: "Total Schemes",
    pendingApps: "Pending Applications",
    recentActivity: "Recent Activity",
    actions: "Actions",
    name: "Name",
    phone: "Phone",
    state: "State",
    district: "District",
    status: "Status",
    date: "Date",
    approve: "Approve",
    reject: "Reject",
    view: "View",
    search: "Search...",
    filter: "Filter"
  },
  hi: {
    title: "किसान योजना पोर्टल",
    admin: "एडमिन डैशबोर्ड",
    farmers: "किसान",
    schemes: "योजनाएं",
    applications: "आवेदन",
    status: "स्थिति",
    approve: "स्वीकृत",
    reject: " अस्वीकार"
  }
};

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  const lang = req.query.lang || 'en';
  req.t = (key) => translations[lang][key] || key;
  req.currentLang = lang;
  next();
});

// Auth middleware (simple for demo)
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer admin-token') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  req.user = { username: 'admin', role: 'admin' };
  next();
}

// API Routes
app.get('/api/farmers', requireAuth, (req, res) => {
  res.json({ success: true, farmers });
});

app.get('/api/schemes', requireAuth, (req, res) => {
  res.json({ success: true, schemes });
});

app.get('/api/applications', requireAuth, (req, res) => {
  res.json({ success: true, applications });
});

app.post('/api/applications/:id/approve', requireAuth, (req, res) => {
  const app = applications.find(a => a.id == req.params.id);
  if (app) {
    app.status = 'approved';
    res.json({ success: true, message: 'Application approved' });
  } else {
    res.status(404).json({ success: false, error: 'Application not found' });
  }
});

app.post('/api/applications/:id/reject', requireAuth, (req, res) => {
  const app = applications.find(a => a.id == req.params.id);
  if (app) {
    app.status = 'rejected';
    res.json({ success: true, message: 'Application rejected' });
  } else {
    res.status(404).json({ success: false, error: 'Application not found' });
  }
});

// Admin UI - Login page
app.get('/admin/login', (req, res) => {
  const t = translations[req.currentLang];
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${t.title} - Admin Login</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .login-box { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 400px; }
    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { background: #667eea; color: white; padding: 12px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
    button:hover { background: #5a6fd8; }
    .logo { text-align: center; margin-bottom: 1rem; font-size: 24px; color: #667eea; }
  </style>
</head>
<body>
  <div class="login-box">
    <div class="logo">🌾 ${t.title}</div>
    <h2 style="text-align: center; margin-top: 0;">Admin Login</h2>
    <form method="post" action="/admin/login">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <p style="text-align: center; color: #666; font-size: 12px;">Demo credentials: admin / admin123</p>
  </div>
</body>
</html>
  `);
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.redirect('/admin?token=admin-token');
  } else {
    res.redirect('/admin/login?error=invalid');
  }
});

// Main Admin Dashboard (accessible after login)
app.get('/admin', (req, res) => {
  // For demo, we'll use session-based auth
  if (!req.session?.admin) {
    return res.redirect('/admin/login');
  }

  const t = translations[req.currentLang];

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${t.title} - ${t.admin}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    body { background: #f0f2f5; min-height: 100vh; }
    .dashboard { display: flex; min-height: 100vh; }
    .sidebar { width: 250px; background: #1a1d23; color: white; padding: 20px 0; }
    .sidebar h2 { padding: 0 20px 20px; border-bottom: 1px solid #333; font-size: 20px; }
    .sidebar a { display: block; padding: 12px 20px; color: #b0b3b8; text-decoration: none; transition: 0.2s; }
    .sidebar a:hover, .sidebar a.active { background: #2a2d33; color: white; }
    .sidebar a i { width: 20px; margin-right: 10px; }
    .main { flex: 1; padding: 20px; overflow-y: auto; }
    .header { background: white; padding: 15px 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card h3 { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; }
    .stat-card .number { font-size: 32px; font-weight: bold; color: #667eea; }
    .card { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .card-header { padding: 15px 20px; border-bottom: 1px solid #e8e8e8; font-weight: bold; }
    .card-body { padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e8e8e8; }
    th { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
    .badge-success { background: #d4edda; color: #155724; }
    .badge-warning { background: #fff3cd; color: #856404; }
    .badge-danger { background: #f8d7da; color: #721c24; }
    .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .btn-sm { padding: 4px 8px; font-size: 11px; }
    .btn-success { background: #28a745; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-primary { background: #007bff; color: white; }
    .actions { display: flex; gap: 5px; }
    .search-box { margin-bottom: 15px; }
    .search-box input { width: 300px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; }
    .filters { display: flex; gap: 10px; margin-bottom: 15px; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="dashboard">
    <!-- Sidebar -->
    <div class="sidebar">
      <h2>🌾 ${t.title}</h2>
      <a href="#" class="active"><i>📊</i> ${t.quickStats}</a>
      <a href="#farmers"><i>👥</i> ${t.farmers}</a>
      <a href="#schemes"><i>📋</i> ${t.schemes}</a>
      <a href="#applications"><i>📄</i> ${t.applications}</a>
      <a href="#notifications"><i>🔔</i> ${t.notifications}</a>
      <a href="#reports"><i>📈</i> ${t.reports}</a>
      <a href="#settings"><i>⚙️</i> ${t.settings}</a>
      <a href="/" style="margin-top: auto;"><i>🏠</i> Back to Portal</a>
    </div>

    <!-- Main Content -->
    <div class="main">
      <!-- Header -->
      <div class="header">
        <h1>${t.admin}</h1>
        <div>
          <span>👤 Admin</span>
          <a href="/" style="margin-left: 20px; color: #667eea; text-decoration: none;">${t.logout}</a>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div class="stat-card">
          <h3>${t.totalFarmers}</h3>
          <div class="number" id="totalFarmers">${farmers.length}</div>
        </div>
        <div class="stat-card">
          <h3>${t.totalSchemes}</h3>
          <div class="number" id="totalSchemes">${schemes.length}</div>
        </div>
        <div class="stat-card">
          <h3>${t.pendingApps}</h3>
          <div class="number" id="pendingApps">${applications.filter(a => a.status === 'pending').length}</div>
        </div>
        <div class="stat-card">
          <h3>Total Applications</h3>
          <div class="number">${applications.length}</div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="card" id="applications">
        <div class="card-header">Recent Applications</div>
        <div class="card-body">
          <div class="search-box">
            <input type="text" placeholder="${t.search}" onkeyup="filterTable(this, 'appTable')">
          </div>
          <table id="appTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Farmer</th>
                <th>Scheme</th>
                <th>${t.status}</th>
                <th>${t.date}</th>
                <th>${t.actions}</th>
              </tr>
            </thead>
            <tbody>
              ${applications.map(app => `
                <tr data-status="${app.status.toLowerCase()}">
                  <td>#${app.id}</td>
                  <td>${app.farmerName || 'N/A'}</td>
                  <td>${app.schemeTitle || 'N/A'}</td>
                  <td><span class="badge badge-${app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}">${app.status.toUpperCase()}</span></td>
                  <td>${new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td class="actions">
                    <button class="btn btn-sm btn-success" onclick="updateStatus(${app.id}, 'approved')">${t.approve}</button>
                    <button class="btn btn-sm btn-danger" onclick="updateStatus(${app.id}, 'rejected')">${t.reject}</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Farmers List -->
      <div class="card" id="farmers">
        <div class="card-header">${t.farmers} (${farmers.length})</div>
        <div class="card-body">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>${t.name}</th>
                <th>${t.phone}</th>
                <th>${t.state}</th>
                <th>${t.district}</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              ${farmers.map(f => `
                <tr>
                  <td>#${f.id}</td>
                  <td>${f.name}</td>
                  <td>${f.phone}</td>
                  <td>${f.state}</td>
                  <td>${f.district || 'N/A'}</td>
                  <td>${new Date(f.registeredAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    function filterTable(input, tableId) {
      const filter = input.value.toLowerCase();
      const table = document.getElementById(tableId);
      const tr = table.getElementsByTagName('tr');
      for (let i = 1; i < tr.length; i++) {
        const txtValue = tr[i].textContent || tr[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }

    async function updateStatus(id, status) {
      const response = await fetch('/api/applications/' + id + '/' + status, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        location.reload();
      } else {
        alert('Error: ' + data.error);
      }
    }
  </script>
</body>
</html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Farmer Scheme Portal Admin Demo Running!`);
  console.log(`📍 Local: http://localhost:${PORT}/admin`);
  console.log(`🔑 Login: http://localhost:${PORT}/admin/login`);
  console.log(`\n💡 Credentials: admin / admin123\n`);
});