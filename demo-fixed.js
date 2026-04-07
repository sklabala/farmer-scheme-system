const express = require('express');
const app = express();
const PORT = 3000;

// Simple in-memory storage
const farmers = [];
const applications = [];
let farmerIdCounter = 1;

// Sample schemes
const schemes = [
  {
    id: 1,
    title: "PM-KISAN",
    description: "Direct income support of ₹6000 per year to farmers",
    category: "Subsidy",
    state: "All India",
    deadline: "2026-03-31",
    eligibility: ["Small farmers", "Marginal farmers"],
    benefits: "₹6000 per year in 3 installments"
  },
  {
    id: 2,
    title: "PM Fasal Bima Yojana",
    description: "Crop insurance scheme for farmers",
    category: "Insurance",
    state: "All India",
    deadline: "2026-06-30",
    eligibility: ["All farmers"],
    benefits: "Insurance coverage for crop damage"
  }
];

// i18n translations
const translations = {
  en: {
    title: "Farmer Scheme Portal",
    welcome: "Welcome",
    register: "Register",
    login: "Login",
    schemes: "Schemes",
    apply: "Apply Now",
    dashboard: "Dashboard",
    profile: "Profile",
    logout: "Logout",
    search: "Search...",
    filter: "Filter",
    name: "Full Name",
    phone: "Phone Number",
    state: "State",
    district: "District",
    submit: "Submit",
    totalSchemes: "Total Schemes",
    totalFarmers: "Registered Farmers",
    alreadyApplied: "Already Applied",
    newHere: "New here?",
    registerNow: "Register now"
  },
  hi: {
    title: "किसान योजना पोर्टल",
    welcome: "स्वागत है",
    register: "पंजीकरण",
    login: "लॉगिन",
    schemes: "योजनाएं",
    apply: "आवेदन करें",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    logout: "लॉगआउट",
    search: "खोजें...",
    filter: "फ़िल्टर",
    name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    state: "राज्य",
    district: "ज़िला",
    submit: "जमा करें",
    totalSchemes: "कुल योजनाएं",
    totalFarmers: "पंजीकृत किसान"
  }
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Language detection
app.use((req, res, next) => {
  const lang = req.query.lang || 'en';
  req.t = (key) => translations[lang][key] || key;
  req.currentLang = lang;
  next();
});

// API Routes
app.get('/api/schemes', (req, res) => {
  const { category, search } = req.query;
  let filtered = schemes;

  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category === category);
  }

  if (search) {
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({ success: true, count: filtered.length, schemes: filtered });
});

app.get('/api/schemes/:id', (req, res) => {
  const scheme = schemes.find(s => s.id == req.params.id);
  if (scheme) {
    res.json({ success: true, scheme });
  } else {
    res.status(404).json({ success: false, error: 'Scheme not found' });
  }
});

app.get('/api/farmers', (req, res) => {
  res.json({ success: true, farmers });
});

app.post('/api/farmers/register', (req, res) => {
  const { name, phone, state, district } = req.body;

  if (!name || !phone || !state || !district) {
    return res.status(400).json({ success: false, error: 'All fields required' });
  }

  // Check if phone already registered
  if (farmers.some(f => f.phone === phone)) {
    return res.status(409).json({ success: false, error: 'Phone already registered' });
  }

  const farmer = {
    id: farmerIdCounter++,
    name,
    phone,
    state,
    district,
    registeredAt: new Date().toISOString(),
    appliedSchemes: []
  };

  farmers.push(farmer);
  res.status(201).json({ success: true, farmer, message: 'Registration successful' });
});

app.post('/api/applications', (req, res) => {
  const { farmerId, schemeId } = req.body;

  const farmer = farmers.find(f => f.id === farmerId);
  const scheme = schemes.find(s => s.id === schemeId);

  if (!farmer) return res.status(404).json({ success: false, error: 'Farmer not found' });
  if (!scheme) return res.status(404).json({ success: false, error: 'Scheme not found' });

  // Check if already applied
  if (farmer.appliedSchemes.includes(schemeId)) {
    return res.status(409).json({ success: false, error: 'Already applied' });
  }

  const application = {
    id: applications.length + 1,
    farmerId,
    schemeId,
    schemeTitle: scheme.title,
    farmerName: farmer.name,
    status: 'submitted',
    appliedAt: new Date().toISOString()
  };

  applications.push(application);
  farmer.appliedSchemes.push(schemeId);

  res.status(201).json({ success: true, application, message: 'Application submitted' });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalSchemes: schemes.length,
      totalFarmers: farmers.length,
      totalApplications: applications.length,
      activeSchemes: schemes.filter(s => new Date(s.deadline) > new Date()).length
    }
  });
});

// Enhanced UI with registration
app.get('/', (req, res) => {
  const t = translations[req.currentLang];
  const stats = { totalSchemes: schemes.length, totalFarmers: farmers.length };

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${t.title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: white; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .logo { font-size: 24px; font-weight: bold; color: #667eea; }
    .lang-switch { display: flex; gap: 5px; }
    .lang-btn { padding: 8px 16px; border: 1px solid #667eea; border-radius: 6px; background: white; color: #667eea; cursor: pointer; transition: all 0.2s; }
    .lang-btn.active { background: #667eea; color: white; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
    .stat-box { background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .stat-number { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
    h2 { color: #333; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; color: #555; font-weight: 500; }
    input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
    input:focus, select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .btn { display: inline-block; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; text-decoration: none; transition: background 0.2s; }
    .btn:hover { background: #5a6fd8; }
    .btn-success { background: #48bb78; }
    .btn-success:hover { background: #38a169; }
    .btn-danger { background: #f56565; }
    .btn-danger:hover { background: #e53e3e; }
    .tag { display: inline-block; padding: 4px 10px; background: #e2e8f0; border-radius: 20px; font-size: 12px; margin: 2px; }
    .deadline { color: #e53e3e; font-weight: bold; }
    .actions { margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap; }
    .hidden { display: none; }
    .section { background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .success-msg { background: #c6f6d5; color: #22543d; padding: 10px; border-radius: 6px; margin-bottom: 15px; }
    .error-msg { background: #fed7d7; color: #742a2a; padding: 10px; border-radius: 6px; margin-bottom: 15px; }
    .section-title { font-size: 18px; color: #2d3748; margin-bottom: 15px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f7fafc; font-weight: 600; color: #4a5568; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🌾 ${t.title}</div>
      <div class="lang-switch">
        <button class="lang-btn ${req.currentLang === 'en' ? 'active' : ''}" onclick="setLang('en')">EN</button>
        <button class="lang-btn ${req.currentLang === 'hi' ? 'active' : ''}" onclick="setLang('hi')">हिंदी</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat-box">
        <div class="stat-number">${stats.totalSchemes}</div>
        <div class="stat-label">${t.totalSchemes}</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${stats.totalFarmers}</div>
        <div class="stat-label">${t.totalFarmers}</div>
      </div>
      <div class="stat-box">
        <div class="stat-number">${applications.length}</div>
        <div class="stat-label">Applications</div>
      </div>
    </div>

    <!-- Registration Section -->
    <div class="section" id="registerSection">
      <h2 class="section-title">📝 ${t.register} - ${t.name}</h2>
      <div id="registerForm">
        <div class="form-group">
          <label>${t.name}</label>
          <input type="text" id="regName" placeholder="${t.name}">
        </div>
        <div class="form-group">
          <label>${t.phone}</label>
          <input type="tel" id="regPhone" placeholder="9876543210">
        </div>
        <div class="form-group">
          <label>${t.state}</label>
          <input type="text" id="regState" placeholder="e.g., Maharashtra, Tamil Nadu">
        </div>
        <div class="form-group">
          <label>${t.district}</label>
          <input type="text" id="regDistrict" placeholder="e.g., Pune, Chennai">
        </div>
        <button class="btn btn-success" onclick="register()">${t.submit}</button>
        <div id="registerMsg" class="hidden"></div>
      </div>
    </div>

    <!-- Schemes -->
    <div class="section">
      <h2 class="section-title">📋 ${t.schemes}</h2>
      <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div>
          <label>${t.search}</label>
          <input type="text" id="searchInput" placeholder="${t.search}..." onkeyup="filterSchemes()">
        </div>
        <div>
          <label>${t.filter}</label>
          <select id="categoryFilter" onchange="filterSchemes()">
            <option value="all">All Categories</option>
            <option value="Subsidy">Subsidy</option>
            <option value="Insurance">Insurance</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Solar">Solar</option>
          </select>
        </div>
      </div>

      <div class="grid" id="schemesGrid">
        <!-- Schemes will be rendered here -->
      </div>
    </div>

    <!-- Farmer Applications (only visible if logged in) -->
    <div class="section" id="applicationsSection" style="display: none;">
      <h2 class="section-title">📄 My Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Farmer</th>
            <th>Scheme</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id="applicationsTable"></tbody>
      </table>
    </div>
  </div>

  <script>
    let currentLang = '${req.currentLang}';
    let currentFarmer = null;

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      renderSchemes();
      loadFarmers();
    });

    function setLang(lang) {
      currentLang = lang;
      window.location.search = '?lang=' + lang;
    }

    function showMessage(elementId, msg, isError = false) {
      const el = document.getElementById(elementId);
      el.innerHTML = msg;
      el.className = isError ? 'error-msg' : 'success-msg';
      el.classList.remove('hidden');
      setTimeout(() => el.classList.add('hidden'), 3000);
    }

    async function register() {
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const state = document.getElementById('regState').value.trim();
      const district = document.getElementById('regDistrict').value.trim();

      if (!name || !phone || !state || !district) {
        showMessage('registerMsg', 'Please fill all fields', true);
        return;
      }

      try {
        const response = await fetch('/api/farmers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, state, district })
        });

        const data = await response.json();
        if (data.success) {
          currentFarmer = data.farmer;
          showMessage('registerMsg', 'Registration successful! You can now apply for schemes.');
          document.getElementById('registerForm').reset();
          loadFarmers();
        } else {
          showMessage('registerMsg', data.error || 'Registration failed', true);
        }
      } catch (error) {
        showMessage('registerMsg', 'Network error. Please try again.', true);
      }
    }

    function renderSchemes() {
      fetch('/api/schemes')
        .then(r => r.json())
        .then(data => {
          const grid = document.getElementById('schemesGrid');
          grid.innerHTML = data.schemes.map(scheme => \`
            <div class="card">
              <span class="tag">\${scheme.category}</span>
              <h3 style="margin: 10px 0;">\${scheme.title}</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">\${scheme.description}</p>
              <div style="margin-bottom: 10px;">
                <span class="tag">📍 \${scheme.state}</span>
                <span class="tag deadline">⏰ \${scheme.deadline}</span>
              </div>
              <div class="actions">
                <button class="btn" onclick="applyForScheme(\${scheme.id})">\${t.apply}</button>
              </div>
            </div>
          \`).join('');
        })
        .catch(err => {
          console.error('Failed to load schemes:', err);
          document.getElementById('schemesGrid').innerHTML = '<p>Error loading schemes. Please refresh.</p>';
        });
    }

    function filterSchemes() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const category = document.getElementById('categoryFilter').value;

      const url = '/api/schemes?search=' + encodeURIComponent(search) +
                  (category !== 'all' ? '&category=' + category : '');

      fetch(url)
        .then(r => r.json())
        .then(data => {
          const grid = document.getElementById('schemesGrid');
          grid.innerHTML = data.schemes.map(scheme => \`
            <div class="card">
              <span class="tag">\${scheme.category}</span>
              <h3 style="margin: 10px 0;">\${scheme.title}</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 10px;">\${scheme.description}</p>
              <div style="margin-bottom: 10px;">
                <span class="tag">📍 \${scheme.state}</span>
                <span class="tag deadline">⏰ \${scheme.deadline}</span>
              </div>
              <div class="actions">
                <button class="btn" onclick="applyForScheme(\${scheme.id})">\${t.apply}</button>
              </div>
            </div>
          \`).join('');
        });
    }

    async function applyForScheme(schemeId) {
      if (!currentFarmer) {
        alert('Please register first by filling the form above!');
        document.getElementById('registerSection').scrollIntoView({ behavior: 'smooth' });
        return;
      }

      try {
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ farmerId: currentFarmer.id, schemeId })
        });

        const data = await response.json();
        if (data.success) {
          alert('Application submitted successfully!');
          renderApplications();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }

    async function loadFarmers() {
      const res = await fetch('/api/farmers');
      const data = await res.json();
      // Could show recent farmers list if needed
    }

    async function renderApplications() {
      if (!currentFarmer) return;

      const res = await fetch('/api/applications');
      const data = await res.json();

      const myApps = data.applications.filter(app => app.farmerId === currentFarmer.id);

      document.getElementById('applicationsSection').style.display = 'block';
      document.getElementById('applicationsTable').innerHTML = myApps.map(app => \`
        <tr>
          <td>\${app.farmerName}</td>
          <td>\${app.schemeTitle}</td>
          <td><span class="tag">\${app.status}</span></td>
          <td>\${new Date(app.appliedAt).toLocaleDateString()}</td>
        </tr>
      \`).join('');
    }
  </script>
</body>
</html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Farmer Scheme Portal Demo Running!`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   POST   /api/farmers/register   - Farmer registration`);
  console.log(`   GET    /api/schemes           - List schemes`);
  console.log(`   POST   /api/applications      - Apply for scheme`);
  console.log(`   GET    /api/farmers           - List all farmers`);
  console.log(`   GET    /api/stats             - Statistics`);
  console.log(`   GET    /                     - Demo UI with registration\n`);
  console.log(`💡 Use ?lang=hi for Hindi interface`);
  console.log(`   Example: http://localhost:${PORT}/?lang=hi\n`);
});

module.exports = app;