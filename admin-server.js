const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3001; // Different port

// Session middleware
app.use(session({
  secret: 'farmer-scheme-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 3600000 }
}));

app.use(express.json());
app.use(express.static('public'));

// In-memory data
const farmers = [
  { id: 1, name: 'Ramesh Kumar', phone: '9876543210', state: 'Maharashtra', district: 'Pune', registeredAt: new Date('2024-03-15') },
  { id: 2, name: 'Sita Devi', phone: '8765432109', state: 'Tamil Nadu', district: 'Chennai', registeredAt: new Date('2024-03-16') },
  { id: 3, name: 'Mohan Kumar', phone: '7654321098', state: 'Karnataka', district: 'Bangalore', registeredAt: new Date('2024-03-17') }
];

const schemes = [
  { id: 1, title: 'PM-KISAN', category: 'Subsidy', state: 'All India', deadline: '2026-03-31', active: true },
  { id: 2, title: 'PM Fasal Bima Yojana', category: 'Insurance', state: 'All India', deadline: '2026-06-30', active: true },
  { id: 3, title: 'PM Krishi Sinchayee Yojana', category: 'Irrigation', state: 'All India', deadline: '2026-12-31', active: true }
];

const applications = [
  { id: 1, farmerName: 'Ramesh Kumar', schemeTitle: 'PM-KISAN', status: 'approved', appliedAt: new Date('2024-03-15') },
  { id: 2, farmerName: 'Sita Devi', schemeTitle: 'PM Fasal Bima Yojana', status: 'pending', appliedAt: new Date('2024-03-16') },
  { id: 3, farmerName: 'Mohan Kumar', schemeTitle: 'PM Krishi Sinchayee Yojana', status: 'rejected', appliedAt: new Date('2024-03-17') }
];

const trans = {
  title: "Farmer Scheme Portal - Admin",
  dashboard: "Dashboard",
  farmers: "Farmers",
  schemes: "Schemes",
  applications: "Applications",
  totalFarmers: "Total Farmers",
  totalSchemes: "Total Schemes",
  pendingApps: "Pending Applications",
  login: "Login",
  logout: "Logout",
  name: "Name",
  phone: "Phone",
  state: "State",
  district: "District",
  status: "Status",
  date: "Date",
  actions: "Actions",
  approve: "Approve",
  reject: "Reject"
};

// Login page
app.get('/admin/login', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${trans.title} - Login</title>
  <style>
    body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    .login-box { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 400px; }
    h1 { text-align: center; color: #667eea; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; color: #555; }
    input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size: 14px; }
    button { width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-top: 1rem; }
    button:hover { background: #5a6fd8; }
    .error { background: #fee; color: #c33; padding: 10px; border-radius: 6px; margin-bottom: 1rem; }
    .demo-hint { text-align: center; margin-top: 1rem; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="login-box">
    <h1>${trans.title}</h1>
    ${req.query.error ? '<div class="error">Invalid credentials</div>' : ''}
    <form method="POST" action="/admin/login">
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" placeholder="Enter username" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" placeholder="Enter password" required>
      </div>
      <button type="submit">Login</button>
      <div class="demo-hint">Demo credentials: admin / admin123</div>
    </form>
  </div>
</body>
</html>
  `);
});

// Login POST
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    req.session.authenticated = true;
    req.session.username = username;
    res.redirect('/admin');
  } else {
    res.redirect('/admin/login?error=invalid');
  }
});

// Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// Admin dashboard (protected)
app.get('/admin', (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect('/admin/login');
  }

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${trans.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    body { background: #f0f2f5; min-height: 100vh; }
    .dashboard { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: #1a1d23; color: #fff; padding: 20px 0; position: fixed; height: 100vh; overflow-y: auto; }
    .sidebar h2 { padding: 0 20px 20px; border-bottom: 1px solid #333; font-size: 20px; color: #667eea; }
    .sidebar a { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: #b0b3b8; text-decoration: none; transition: 0.2s; }
    .sidebar a:hover, .sidebar a.active { background: #2a2d33; color: #fff; }
    .sidebar a.logout { margin-top: auto; border-top: 1px solid #333; color: #f56565; }
    .main { flex: 1; margin-left: 260px; padding: 20px; }
    .header { background: white; padding: 15px 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border-left: 4px solid #667eea; }
    .stat-card h3 { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px; }
    .stat-card .number { font-size: 32px; font-weight: 700; color: #1a1d23; }
    .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 24px; overflow: hidden; }
    .card-header { padding: 16px 20px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; font-weight: 600; color: #495057; display: flex; justify-content: space-between; align-items: center; }
    .card-body { padding: 0; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px 20px; background: #f8f9fa; color: #666; font-weight: 600; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #e9ecef; }
    td { padding: 16px 20px; border-bottom: 1px solid #e9ecef; }
    tr:hover { background: #f8f9fa; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .badge-success { background: #d4edda; color: #155724; }
    .badge-warning { background: #fff3cd; color: #856404; }
    .badge-danger { background: #f8d7da; color: #721c24; }
    .badge-primary { background: #d1ecf1; color: #0c5460; }
    .btn { padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; }
    .btn-sm { padding: 4px 10px; font-size: 12px; }
    .btn-success { background: #28a745; color: white; }
    .btn-success:hover { background: #218838; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-danger:hover { background: #c82333; }
    .btn-primary { background: #007bff; color: white; }
    .btn-primary:hover { background: #0056b3; }
    .actions { display: flex; gap: 8px; }
    .search-box { margin-bottom: 20px; }
    .search-box input { width: 300px; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
    .section-title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #1a1d23; }
  </style>
</head>
<body>
  <div class="dashboard">
    <!-- Sidebar -->
    <div class="sidebar">
      <h2>🌾 Admin Panel</h2>
      <a href="#" class="active"><strong>📊</strong> Dashboard</a>
      <a href="#farmers"><strong>👥</strong> Farmers</a>
      <a href="#schemes"><strong>📋</strong> Schemes</a>
      <a href="#applications"><strong>📄</strong> Applications</a>
      <a href="#notifications"><strong>🔔</strong> Notifications</a>
      <a href="#reports"><strong>📈</strong> Reports</a>
      <a href="/" target="_blank"><strong>🏠</strong> View Portal</a>
      <a href="/admin/logout" class="logout"><strong>🚪</strong> ${trans.logout}</a>
    </div>

    <!-- Main Content -->
    <div class="main">
      <!-- Header -->
      <div class="header">
        <h1>${trans.dashboard}</h1>
        <div>
          <span>👤 Admin</span>
          <a href="/admin/logout" style="margin-left: 20px; color: #dc3545; text-decoration: none;">${trans.logout}</a>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div class="stat-card">
          <h3>${trans.totalFarmers}</h3>
          <div class="number">${farmers.length}</div>
        </div>
        <div class="stat-card">
          <h3>${trans.totalSchemes}</h3>
          <div class="number">${schemes.length}</div>
        </div>
        <div class="stat-card">
          <h3>${trans.pendingApps}</h3>
          <div class="number">${applications.filter(a => a.status === 'pending').length}</div>
        </div>
        <div class="stat-card">
          <h3>Total Applications</h3>
          <div class="number">${applications.length}</div>
        </div>
      </div>

      <!-- Applications -->
      <div class="card" id="applications">
        <div class="card-header">
          <span>Recent Applications</span>
          <span style="font-size: 12px; color: #666;">(${applications.length} total)</span>
        </div>
        <div class="card-body">
          <div class="search-box">
            <input type="text" placeholder="Search applications..." onkeyup="filterTable(this, 'appTable')">
          </div>
          <table id="appTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Farmer</th>
                <th>Scheme</th>
                <th>${trans.status}</th>
                <th>${trans.date}</th>
                <th>${trans.actions}</th>
              </tr>
            </thead>
            <tbody>
              ${applications.map(app => `
                <tr data-status="${app.status}">
                  <td><strong>#${app.id}</strong></td>
                  <td>${app.farmerName}</td>
                  <td>${app.schemeTitle}</td>
                  <td><span class="badge badge-${app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}">${app.status.toUpperCase()}</span></td>
                  <td>${new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td class="actions">
                    <button class="btn btn-sm btn-success" onclick="updateStatus(${app.id}, 'approved')">${trans.approve}</button>
                    <button class="btn btn-sm btn-danger" onclick="updateStatus(${app.id}, 'rejected')">${trans.reject}</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Farmers List -->
      <div class="card" id="farmers">
        <div class="card-header">Farmer Registrations (${farmers.length})</div>
        <div class="card-body">
          <div class="search-box">
            <input type="text" placeholder="Search farmers..." onkeyup="filterTable(this, 'farmerTable')">
          </div>
          <table id="farmerTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>${trans.name}</th>
                <th>${trans.phone}</th>
                <th>${trans.state}</th>
                <th>${trans.district}</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              ${farmers.map(f => `
                <tr>
                  <td><strong>#${f.id}</strong></td>
                  <td>${f.name}</td>
                  <td>${f.phone}</td>
                  <td>${f.state}</td>
                  <td>${f.district}</td>
                  <td>${new Date(f.registeredAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Schemes -->
      <div class="card" id="schemes">
        <div class="card-header">Available Schemes (${schemes.length})</div>
        <div class="card-body">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>State</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${schemes.map(s => `
                <tr>
                  <td><strong>#${s.id}</strong></td>
                  <td>${s.title}</td>
                  <td>${s.category}</td>
                  <td>${s.state}</td>
                  <td>${new Date(s.deadline).toLocaleDateString()}</td>
                  <td><span class="badge badge-success">ACTIVE</span></td>
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
      const rows = table.getElementsByTagName('tr');
      for (let i = 1; i < rows.length; i++) {
        const text = rows[i].textContent || rows[i].innerText;
        rows[i].style.display = text.toLowerCase().includes(filter) ? '' : 'none';
      }
    }

    async function updateStatus(id, status) {
      if (confirm('Are you sure you want to ' + (status === 'approved' ? 'approve' : 'reject') + ' this application?')) {
        try {
          const response = await fetch('/api/applications/' + id + '/' + status, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            alert('Application ' + status + 'd successfully!');
            location.reload();
          } else {
            alert('Failed to update application');
          }
        } catch (error) {
          alert('Error: ' + error.message);
        }
      }
    }
  </script>
</body>
</html>
  `);
});

// API endpoints
app.get('/api/farmers', (req, res) => {
  res.json({ success: true, farmers });
});

app.get('/api/schemes', (req, res) => {
  res.json({ success: true, schemes });
});

app.get('/api/applications', (req, res) => {
  res.json({ success: true, applications });
});

app.post('/api/applications/:id/approve', (req, res) => {
  const appId = parseInt(req.params.id);
  const application = applications.find(a => a.id === appId);
  if (application) {
    application.status = 'approved';
    res.json({ success: true, message: 'Application approved' });
  } else {
    res.status(404).json({ success: false, error: 'Application not found' });
  }
});

app.post('/api/applications/:id/reject', (req, res) => {
  const appId = parseInt(req.params.id);
  const application = applications.find(a => a.id === appId);
  if (application) {
    application.status = 'rejected';
    res.json({ success: true, message: 'Application rejected' });
  } else {
    res.status(404).json({ success: false, error: 'Application not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Admin Server Running!`);
  console.log(`📍 http://localhost:${PORT}/admin/login`);
  console.log(`🔑 Credentials: admin / admin123\n`);
});