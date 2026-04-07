const express = require('express');
const app = express();
const PORT = 3000;

// Sample data
const schemes = [
  {
    id: 1,
    title: "PM-KISAN",
    description: "Direct income support of ₹6000 per year to farmers",
    category: "Subsidy",
    state: "All India",
    deadline: "2026-03-31",
    eligibility: ["Small farmers", "Marginal farmers"]
  },
  {
    id: 2,
    title: "PM Fasal Bima Yojana",
    description: "Crop insurance scheme for farmers",
    category: "Insurance",
    state: "All India",
    deadline: "2026-06-30",
    eligibility: ["All farmers"]
  }
];

const users = [
  { id: 1, name: "Ramesh Kumar", phone: "9876543210", lang: "en" },
  { id: 2, name: "Sita Devi", phone: "8765432109", lang: "hi" }
];

// In-memory database for demo
const farmers = [];
let farmerIdCounter = 1;

// Simple i18n dictionary
const translations = {
  en: {
    welcome: "Welcome to Farmer Scheme Portal",
    schemes: "Schemes",
    apply: "Apply Now",
    dashboard: "Dashboard",
    profile: "Profile",
    logout: "Logout",
    search: "Search schemes...",
    filter: "Filter by category"
  },
  hi: {
    welcome: "किसान योजना पोर्टल का स्वागत है",
    schemes: "योजनाएं",
    apply: "अभी आवेदन करें",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफ़ाइल",
    logout: "लॉगआउट",
    search: "योजनाओं को खोजें...",
    filter: "श्रेणी के अनुसार फ़िल्टर"
  }
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Language detection middleware
app.use((req, res, next) => {
  const lang = req.query.lang || req.acceptsLanguages(['en', 'hi']) || 'en';
  req.t = (key) => translations[lang][key] || key;
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

  res.json({
    success: true,
    count: filtered.length,
    schemes: filtered
  });
});

app.get('/api/schemes/:id', (req, res) => {
  const scheme = schemes.find(s => s.id == req.params.id);
  if (scheme) {
    res.json({ success: true, scheme });
  } else {
    res.status(404).json({ success: false, error: 'Scheme not found' });
  }
});

app.get('/api/users', (req, res) => {
  res.json({ success: true, users });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalSchemes: schemes.length,
      totalUsers: users.length,
      activeSchemes: schemes.filter(s => new Date(s.deadline) > new Date()).length
    }
  });
});

// Demo UI (single HTML page)
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Farmer Scheme Portal - Demo</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .header { background: #4CAF50; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
    .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    .card { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .btn { background: #4CAF50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin: 0.25rem; }
    .btn:hover { background: #45a049; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .language-switcher { display: flex; gap: 0.5rem; }
    .lang-btn { padding: 0.25rem 0.75rem; background: #fff; color: #333; border: 1px solid #ddd; }
    .lang-btn.active { background: #4CAF50; color: white; border-color: #4CAF50; }
    .stat { display: inline-block; margin: 0.5rem; padding: 1rem; background: #e8f5e9; border-radius: 8px; }
    .tag { display: inline-block; padding: 0.25rem 0.5rem; background: #2196F3; color: white; border-radius: 4px; font-size: 0.875rem; margin: 0.25rem; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 id="welcome">Farmer Scheme Portal</h1>
      <small>Demo Version - Running on port ${PORT}</small>
    </div>
    <div class="language-switcher">
      <button class="lang-btn active" onclick="setLanguage('en')">EN</button>
      <button class="lang-btn" onclick="setLanguage('hi')">हिंदी</button>
    </div>
  </div>

  <div class="container">
    <div class="card">
      <h2>Quick Stats</h2>
      <div class="stat">
        <strong id="totalSchemes">Total Schemes:</strong> <span id="schemesCount">0</span>
      </div>
      <div class="stat">
        <strong id="totalUsers">Registered Users:</strong> <span id="usersCount">0</span>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h2 id="schemesTitle">Available Schemes</h2>
        <div>
          <input type="text" id="search" placeholder="Search..." style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
          <select id="filter" style="padding: 0.5rem; margin-left: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            <option value="all">All Categories</option>
            <option value="Subsidy">Subsidy</option>
            <option value="Insurance">Insurance</option>
          </select>
        </div>
      </div>
      <div class="grid" id="schemesList"></div>
    </div>

    <div class="card">
      <h2>Sample Registered Farmers</h2>
      <ul id="usersList"></ul>
    </div>
  </div>

  <script>
    let currentLang = 'en';
    const translations = {
      en: {
        welcome: "Farmer Scheme Portal",
        schemes: "Available Schemes",
        apply: "Apply Now",
        search: "Search...",
        filter: "Filter",
        totalSchemes: "Total Schemes",
        totalUsers: "Registered Users",
        eligibility: "Eligibility:"
      },
      hi: {
        welcome: "किसान योजना पोर्टल",
        schemes: "उपलब्ध योजनाएं",
        apply: "अभी आवेदन करें",
        search: "खोजें...",
        filter: "फ़िल्टर",
        totalSchemes: "कुल योजनाएं",
        totalUsers: "पंजीकृत उपयोगकर्ता",
        eligibility: "पात्रता:"
      }
    };

    function setLanguage(lang) {
      currentLang = lang;
      document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      updateUI();
    }

    function updateUI() {
      const t = translations[currentLang];
      document.getElementById('welcome').textContent = t.welcome;
      document.getElementById('schemesTitle').textContent = t.schemes;
      document.getElementById('totalSchemes').innerText = t.totalSchemes + ':';
      document.getElementById('totalUsers').innerText = t.totalUsers + ':';
      document.querySelector('#search').placeholder = t.search;
      document.querySelector('#filter').previousElementSibling.textContent = t.filter + ':';
    }

    async function loadData() {
      const [schemesRes, usersRes] = await Promise.all([
        fetch('/api/schemes').then(r => r.json()),
        fetch('/api/users').then(r => r.json())
      ]);

      document.getElementById('schemesCount').textContent = schemesRes.count;
      document.getElementById('usersCount').textContent = usersRes.users.length;

      const schemesList = document.getElementById('schemesList');
      schemesList.innerHTML = schemesRes.schemes.map(s => \`
        <div class="card" style="margin:0;">
          <h3>\${s.title}</h3>
          <p>\${s.description}</p>
          <span class="tag">\${s.category}</span>
          <span class="tag">\${s.state}</span>
          <p><strong>Deadline:</strong> \${s.deadline}</p>
          <p><strong>\${translations[currentLang].eligibility}</strong> \${s.eligibility.join(', ')}</p>
          <button class="btn" onclick="alert('Application started for: \${s.title}')">\${translations[currentLang].apply}</button>
        </div>
      \`).join('');

      const usersList = document.getElementById('usersList');
      usersList.innerHTML = usersRes.users.map(u => \`
        <li>\${u.name} (📞 \${u.phone}) - Language: \${u.lang.toUpperCase()}</li>
      \`).join('');
    }

    document.getElementById('search').addEventListener('input', filterSchemes);
    document.getElementById('filter').addEventListener('change', filterSchemes);

    async function filterSchemes() {
      const search = document.getElementById('search').value;
      const category = document.getElementById('filter').value;
      const query = new URLSearchParams({ search, category }).toString();
      const res = await fetch('/api/schemes?' + query).then(r => r.json());
      // Re-render schemes list
      const schemesList = document.getElementById('schemesList');
      schemesList.innerHTML = res.schemes.map(s => \`<div class="card" style="margin:0;"><h3>\${s.title}</h3><p>\${s.description}</p><span class="tag">\${s.category}</span><br><button class="btn">\${translations[currentLang].apply}</button></div>\`).join('');
    }

    loadData();
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
  console.log(`   GET /api/schemes - List schemes (filterable)`);
  console.log(`   GET /api/schemes/:id - Scheme details`);
  console.log(`   GET /api/users - List users`);
  console.log(`   GET /api/stats - Statistics`);
  console.log(`   GET / - Demo UI (with language switching)\n`);
  console.log(`💡 Use ?lang=hi for Hindi interface`);
  console.log(`   Example: http://localhost:${PORT}/?lang=hi\n`);
});

module.exports = app;