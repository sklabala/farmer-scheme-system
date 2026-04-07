const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Mock data for demonstration
const mockFarmers = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    phone: '9876543210',
    email: 'ramesh@example.com',
    state: 'Maharashtra',
    district: 'Pune',
    role: 'Farmer',
    verified: true
  },
  {
    id: 2,
    name: 'Sita Devi',
    phone: '8765432109',
    state: 'Tamil Nadu',
    role: 'Farmer',
    verified: true
  },
  {
    id: 3,
    name: 'Mohan Kumar',
    phone: '7654321098',
    state: 'Karnataka',
    role: 'Farmer',
    verified: true
  }
];

// Mock collection of schemes
const mockSchemes = [
  {
    id: 1,
    title: 'PM-KISAN',
    description: 'Direct income support to small and marginal farmers',
    category: 'Subsidy',
    state: 'All India',
    deadline: new Date('2026-03-31T23:59:59'),
    active: true
  },
  {
    id: 2,
    title: 'PM-KISAN PM-Kisan Samman Nidhi',
    category: 'Subsidy',
    state: 'All India',
    deadline: new Date('2025-12-31T23:59:59'),
    active: true
  },
  {
    id: 3,
    title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    description: "Program for water conservation and micro irrigation",
    category: 'Irrigation',
    state: 'All India',
    deadline: new Date('2027-12-31'),
    active: true
  }
];

// Mock security roles
const ROLES = ['admin', 'auditor', 'viewer'];

// Mock admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('public/uploads'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SIMULATED DATABASE
const db = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$abc123',
      role: 'admin',
      createdAt: new Date()
    }
  ]
};

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public', {
  setHeaders: (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
});

app.set('view engine', 'ejs');

// Mock functions for role checking
function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).redirect('/not-authorized');
    }
    next();
  }
}

app.get('/admin', authorizeRole('admin'), async (req, res) => {
  // Mock data for demo
  const farmers = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      phone: '9876543210',
      email: 'ramesh@example.com',
      state: 'Maharashtra',
      district: 'Pune',
      role: 'Farmer',
      verified: true
    },
    {
      id: 2,
      name: 'Sita Devi',
      phone: '8765432109',
      state: 'Tamil Nadu',
      role: 'Farmer',
      verified: true
    }
  ];

  const schemes = [
    {
      id: 1,
      title: 'PM-KISAN',
      description: 'Direct income support to small and marginal farmers',
      category: 'Subsidy',
      state: 'All India',
      deadline: new Date('2026-03-31T23:59:59'),
      active: true
    },
    {
      id: 2,
      title: 'PM Fasal Bima Yojana',
      description: 'Crop insurance scheme for farmers',
      category: 'Insurance',
      state: 'All India',
      deadline: new Date('2026-06-30T23:59:59'),
      active: true
    }
  ];

  const applications = [
    {
      id: 1,
      farmerName: 'Ramesh Kumar',
      schemeTitle: 'PM-KISAN',
      status: 'Approved',
      appliedAt: new Date()
    },
    {
      id: 2,
      farmerName: 'Sita Devi',
      schemeTitle: 'PM Fasal Bima Yojana',
      status: 'Pending',
      appliedAt: new Date()
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Scheme Available',
      message: 'PM-KISAN scheme is now open for applications',
      createdAt: new Date(),
      read: false
    },
    {
      id: 2,
      title: 'Deadline Reminder',
      message: 'Application deadline for PM Fasal Bima Yojana approaching',
      createdAt: new Date(),
      read: true
    }
  ];

  res.render('admin-dashboard', {
    user: { username: 'admin', role: 'admin' },
    farmers,
    schemes,
    applications,
    notifications,
    tasks: [
      'Process Applications',
      'Generate Reports',
      'Send Reminders',
      'Review Notifications'
    ]
  });
});

app.get('/admin/farmers', authorizeRole('admin'), (req, res) => {
  const farmers = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      phone: '9876543210',
      email: 'ramesh@example.com',
      state: 'Maharashtra',
      district: 'Pune',
      role: 'Farmer',
      verified: true
    },
    {
      id: 2,
      name: 'Sita Devi',
      phone: '8765432109',
      state: 'Tamil Nadu',
      role: 'Farmer',
      verified: true
    },
    {
      id: 3,
      name: 'Mohan Kumar',
      phone: '7654321098',
      state: 'Karnataka',
      role: 'Farmer',
      verified: false
    }
  ];

  res.render('admin-farmers', {
    farmers
  });
});

app.get('/admin/schemes', authorizeRole('admin'), (req, res) => {
  const schemes = [
    {
      id: 1,
      title: 'PM-KISAN',
      description: 'Direct income support to small and marginal farmers',
      category: 'Subsidy',
      state: 'All India',
      deadline: new Date('2026-03-31T23:59:59'),
      active: true
    },
    {
      id: 2,
      title: 'PM Fasal Bima Yojana',
      description: 'Crop insurance scheme for farmers',
      category: 'Insurance',
      state: 'All India',
      deadline: new Date('2026-06-30T23:59:59'),
      active: true
    },
    {
      id: 3,
      title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
      description: "Program for water conservation and micro irrigation",
      category: 'Irrigation',
      state: 'All India',
      deadline: new Date('2027-12-31'),
      active: true
    }
  ];

  res.render('admin-schemes', {
    schemes
  });
});

// Authentication routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Simple auth for demo
  if (username === 'admin' && password === 'admin123') {
    req.user = { username, role: 'admin' };
    res.redirect('/admin');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.get('/logout', (req, res) => {
  req.user = null;
  res.redirect('/login');
});

app.get('/not-authorized', (req, res) => {
  res.render('not-authorized');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🚀 Demo UI available at http://localhost:${PORT}/admin`);
  console.log(`🔑 Login with: admin / admin123`);
});