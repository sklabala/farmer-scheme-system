import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [activeCountModal, setActiveCountModal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [schemes, setSchemes] = useState([
    { id: 1, name: 'PM Kisan Samman Nidhi', category: 'Subsidy', state: 'All India', deadline: '2026-06-30', eligibility: 'Small & Marginal Farmers', amount: '₹6000/year' },
    { id: 2, name: 'Pradhan Mantri Fasal Bima Yojana', category: 'Insurance', state: 'All India', deadline: '2026-05-31', eligibility: 'All Farmers', amount: 'Variable' },
    { id: 3, name: 'Kisan Credit Card', category: 'Loan', state: 'All India', deadline: 'No Deadline', eligibility: 'All Farmers', amount: 'Up to ₹3 Lakh' },
    { id: 4, name: 'Agricultural Equipment Subsidy', category: 'Equipment', state: 'Punjab, Haryana', deadline: '2026-04-30', eligibility: 'Farmer Groups', amount: '50% Subsidy' },
    { id: 5, name: 'Soil Health Card Scheme', category: 'Training', state: 'All India', deadline: 'No Deadline', eligibility: 'All Farmers', amount: 'Free' },
    { id: 6, name: 'Farmer Producer Organization Support', category: 'Loan', state: 'All India', deadline: '2026-07-15', eligibility: 'FPO Members', amount: 'Upto ₹2 Crore' },
    { id: 7, name: 'Crop Insurance Relief', category: 'Insurance', state: 'All India', deadline: '2026-06-15', eligibility: 'Insured Farmers', amount: 'Variable' },
    { id: 8, name: 'Organic Farming Subsidy', category: 'Subsidy', state: 'Multiple States', deadline: '2026-05-30', eligibility: 'Progressive Farmers', amount: '₹50,000-₹100,000' },
    { id: 9, name: 'Agricultural Training Programs', category: 'Training', state: 'All India', deadline: 'Rolling', eligibility: 'All Farmers', amount: 'Free Training' },
    { id: 10, name: 'Drip Irrigation Subsidy', category: 'Equipment', state: 'All States', deadline: '2026-06-30', eligibility: 'All Farmers', amount: '50-60% Subsidy' },
    { id: 11, name: 'Minimum Support Price Scheme', category: 'Subsidy', state: 'All India', deadline: 'Harvest Season', eligibility: 'All Farmers', amount: 'MSP Rate' },
    { id: 12, name: 'Farm Mechanization Grant', category: 'Equipment', state: 'All States', deadline: '2026-08-31', eligibility: 'Farmer Associations', amount: '40% Subsidy' }
  ]);

  const [stats, setStats] = useState({
    applicationsSubmitted: 5,
    totalSchemes: 12,
    subsidySchemes: 4,
    insuranceSchemes: 2,
    loanSchemes: 2,
    equipmentSchemes: 3,
    trainingSchemes: 2,
    upcomingDeadlines: 8
  });

  // Filter schemes based on category and search
  const filteredSchemes = schemes.filter(scheme => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scheme.state.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Subsidy', 'Insurance', 'Loan', 'Equipment', 'Training'];

  const handleApplyClick = (scheme) => {
    setSelectedScheme(scheme);
  };

  const handleApplyNow = (scheme) => {
    console.log('Apply Now clicked for:', scheme.name);
    const message = `✅ Application for "${scheme.name}" submitted successfully!\n\nYou will receive a confirmation email shortly.`;
    console.log('Showing alert:', message);
    
    // Show alert
    alert(message);
    
    // Close modal after alert
    setTimeout(() => {
      setSelectedScheme(null);
    }, 100);
  };

  const categoryColors = {
    'Subsidy': '#FF6B6B',
    'Insurance': '#764ba2',
    'Loan': '#FF8C42',
    'Equipment': '#50E3C2',
    'Training': '#F5A623',
    'All': '#333'
  };

  return (
    <div className="dashboard-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>🌾 Welcome to Farmer Scheme Portal</h1>
          <p>Discover and apply for government schemes beneficial for farmers across India</p>
          <div className="hero-stats">
            <div 
              className="hero-stat-item clickable" 
              onClick={() => setActiveCountModal('applications')}
            >
              <div className="stat-number">5</div>
              <div className="stat-label">Applications Submitted</div>
            </div>
            <div 
              className="hero-stat-item clickable" 
              onClick={() => setActiveCountModal('totalSchemes')}
            >
              <div className="stat-number">{stats.totalSchemes}</div>
              <div className="stat-label">Total Schemes Available</div>
            </div>
            <div 
              className="hero-stat-item clickable" 
              onClick={() => setActiveCountModal('deadlines')}
            >
              <div className="stat-number">{stats.upcomingDeadlines}</div>
              <div className="stat-label">Upcoming Deadlines</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY STATISTICS */}
      <section className="category-stats-section">
        <h2>Schemes by Category</h2>
        <div className="category-stats-grid">
          <div 
            className="category-stat-card"
            onClick={() => { setSelectedCategory('Subsidy'); setSearchTerm(''); }}
            style={{ borderColor: categoryColors['Subsidy'] }}
          >
            <div className="cat-icon">💰</div>
            <div className="cat-count">{stats.subsidySchemes}</div>
            <div className="cat-name">Subsidy Schemes</div>
          </div>
          <div 
            className="category-stat-card"
            onClick={() => { setSelectedCategory('Insurance'); setSearchTerm(''); }}
            style={{ borderColor: categoryColors['Insurance'] }}
          >
            <div className="cat-icon">🛡️</div>
            <div className="cat-count">{stats.insuranceSchemes}</div>
            <div className="cat-name">Insurance Schemes</div>
          </div>
          <div 
            className="category-stat-card"
            onClick={() => { setSelectedCategory('Loan'); setSearchTerm(''); }}
            style={{ borderColor: categoryColors['Loan'] }}
          >
            <div className="cat-icon">🏦</div>
            <div className="cat-count">{stats.loanSchemes}</div>
            <div className="cat-name">Loan Schemes</div>
          </div>
          <div 
            className="category-stat-card"
            onClick={() => { setSelectedCategory('Equipment'); setSearchTerm(''); }}
            style={{ borderColor: categoryColors['Equipment'] }}
          >
            <div className="cat-icon">🚜</div>
            <div className="cat-count">{stats.equipmentSchemes}</div>
            <div className="cat-name">Equipment Subsidies</div>
          </div>
          <div 
            className="category-stat-card"
            onClick={() => { setSelectedCategory('Training'); setSearchTerm(''); }}
            style={{ borderColor: categoryColors['Training'] }}
          >
            <div className="cat-icon">📚</div>
            <div className="cat-count">{stats.trainingSchemes}</div>
            <div className="cat-name">Training Programs</div>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="search-filter-section">
        <h2>Explore Schemes</h2>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="🔍 Search by scheme name or state..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              style={{
                borderBottomColor: selectedCategory === cat ? categoryColors[cat] : 'transparent',
                color: selectedCategory === cat ? categoryColors[cat] : '#666'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="results-info">
          Showing {filteredSchemes.length} of {schemes.length} schemes
        </div>
      </section>

      {/* SCHEMES LIST */}
      <section className="schemes-list-section">
        {filteredSchemes.length > 0 ? (
          <div className="schemes-grid">
            {filteredSchemes.map(scheme => (
              <div key={scheme.id} className="scheme-card">
                <div className="scheme-header">
                  <h3>{scheme.name}</h3>
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: categoryColors[scheme.category] }}
                  >
                    {scheme.category}
                  </span>
                </div>

                <div className="scheme-details">
                  <div className="detail-row">
                    <span className="label">📍 Coverage:</span>
                    <span className="value">{scheme.state}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">📅 Deadline:</span>
                    <span className="value">{scheme.deadline}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">✓ Eligibility:</span>
                    <span className="value">{scheme.eligibility}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">💵 Amount:</span>
                    <span className="value highlight">{scheme.amount}</span>
                  </div>
                </div>

                <div className="scheme-footer">
                  <button 
                    className="apply-btn"
                    onClick={() => handleApplyClick(scheme)}
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-schemes">
            <p>❌ No schemes found matching your criteria</p>
            <button onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}>
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* INFO SECTION */}
      <section className="info-section">
        <div className="info-card">
          <h3>📋 How to Apply?</h3>
          <ol>
            <li>Browse schemes by category or search</li>
            <li>Check eligibility criteria</li>
            <li>Review deadline dates</li>
            <li>Click "Learn More" for full details</li>
            <li>Register as a farmer (if new)</li>
            <li>Submit application with documents</li>
          </ol>
        </div>

        <div className="info-card">
          <h3>❓ Need Help?</h3>
          <ul>
            <li>📞 Call: 1800-FARMER-1 (toll-free)</li>
            <li>✉️ Email: support@farmerportal.gov.in</li>
            <li>💬 Chat: Available 9 AM - 6 PM</li>
            <li>📱 WhatsApp: Click to chat</li>
            <li>🏢 Visit nearest ATMA office</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>✨ Quick Tips</h3>
          <ul>
            <li>✅ Apply early before deadlines</li>
            <li>✅ Keep documents ready</li>
            <li>✅ Verify your eligibility first</li>
            <li>✅ Check scheme benefits</li>
            <li>✅ Track your application status</li>
          </ul>
        </div>
      </section>

      {/* MODAL FOR SCHEME DETAILS */}
      {selectedScheme && (
        <div className="modal-overlay" onClick={() => setSelectedScheme(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedScheme(null)}>✕</button>
            <div className="modal-body">
              <h2>{selectedScheme.name}</h2>
              <div className="scheme-details-modal">
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span 
                    className="value badge" 
                    style={{ backgroundColor: categoryColors[selectedScheme.category] }}
                  >
                    {selectedScheme.category}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">📍 Coverage:</span>
                  <span className="value">{selectedScheme.state}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📅 Deadline:</span>
                  <span className="value">{selectedScheme.deadline}</span>
                </div>
                <div className="detail-row">
                  <span className="label">✓ Eligibility:</span>
                  <span className="value">{selectedScheme.eligibility}</span>
                </div>
                <div className="detail-row">
                  <span className="label">💵 Benefit Amount:</span>
                  <span className="value highlight">{selectedScheme.amount}</span>
                </div>
                <div className="scheme-description">
                  <h3>About This Scheme</h3>
                  <p>This is a government-backed scheme designed to support farmers in achieving better crop yields and sustainable farming practices. Apply now to avail the benefits.</p>
                </div>
              </div>
              <button 
                type="button"
                className="apply-btn" 
                onClick={() => {
                  console.log('Button clicked!');
                  handleApplyNow(selectedScheme);
                }}
                style={{ marginTop: '30px', cursor: 'pointer', pointerEvents: 'auto' }}
              >
                ✅ Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR COUNT DETAILS */}
      {activeCountModal && (
        <div className="modal-overlay" onClick={() => setActiveCountModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveCountModal(null)}>✕</button>
            
            {activeCountModal === 'applications' && (
              <div className="modal-body">
                <h2>📝 Your Applications</h2>
                <div className="applications-list">
                  <div className="application-item">
                    <div className="app-scheme">PM Kisan Samman Nidhi</div>
                    <div className="app-status">✅ Approved</div>
                    <div className="app-date">Submitted: 2026-03-15</div>
                  </div>
                  <div className="application-item">
                    <div className="app-scheme">Pradhan Mantri Fasal Bima Yojana</div>
                    <div className="app-status">⏳ Under Review</div>
                    <div className="app-date">Submitted: 2026-03-20</div>
                  </div>
                  <div className="application-item">
                    <div className="app-scheme">Agricultural Equipment Subsidy</div>
                    <div className="app-status">⏳ Under Review</div>
                    <div className="app-date">Submitted: 2026-03-25</div>
                  </div>
                  <div className="application-item">
                    <div className="app-scheme">Kisan Credit Card</div>
                    <div className="app-status">✅ Approved</div>
                    <div className="app-date">Submitted: 2026-02-10</div>
                  </div>
                  <div className="application-item">
                    <div className="app-scheme">Organic Farming Subsidy</div>
                    <div className="app-status">❌ Rejected</div>
                    <div className="app-date">Submitted: 2026-01-30</div>
                  </div>
                </div>
              </div>
            )}

            {activeCountModal === 'totalSchemes' && (
              <div className="modal-body">
                <h2>📋 All Available Schemes ({schemes.length})</h2>
                <div className="schemes-modal-list">
                  {schemes.map(scheme => (
                    <div key={scheme.id} className="scheme-modal-item">
                      <div className="scheme-name">{scheme.name}</div>
                      <span className="badge" style={{ backgroundColor: categoryColors[scheme.category] }}>
                        {scheme.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeCountModal === 'deadlines' && (
              <div className="modal-body">
                <h2>📅 Upcoming Deadlines ({stats.upcomingDeadlines})</h2>
                <div className="deadlines-list">
                  {schemes
                    .filter(s => s.deadline !== 'No Deadline' && s.deadline !== 'Rolling' && s.deadline !== 'Harvest Season')
                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                    .map(scheme => (
                      <div key={scheme.id} className="deadline-item">
                        <div className="deadline-date">
                          <span className="date-icon">📅</span>
                          {scheme.deadline}
                        </div>
                        <div className="deadline-scheme">{scheme.name}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
