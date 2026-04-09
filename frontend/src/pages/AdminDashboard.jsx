import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [schemes, setSchemes] = useState([
    { id: 1, name: 'PM Kisan Samman Nidhi', category: 'Subsidy', source: 'Government', status: 'Active', budget: '₹60 billion', applicants: 8750 },
    { id: 2, name: 'Pradhan Mantri Fasal Bima Yojana', category: 'Insurance', source: 'Government', status: 'Active', budget: '₹14 billion', applicants: 5420 },
    { id: 3, name: 'Kisan Credit Card', category: 'Loan', source: 'Government', status: 'Active', budget: '₹150 billion', applicants: 12300 }
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', state: 'Punjab', joiningDate: '2024-03-15', status: 'Active' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '9876543211', state: 'Karnataka', joiningDate: '2024-03-20', status: 'Active' },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', phone: '9876543212', state: 'Gujarat', joiningDate: '2024-02-28', status: 'Inactive' }
  ]);

  const [stats] = useState({
    totalSchemes: 25,
    totalUsers: 15420,
    totalApplications: 42850,
    successRate: '87.5%',
    lastScrapeTime: new Date().toLocaleString(),
    scrapeFrequency: '6 hours'
  });

  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2024-04-09 10:30 AM', action: 'Scheme Scraping', status: 'Success', message: '12 new schemes scraped' },
    { id: 2, timestamp: '2024-04-09 09:15 AM', action: 'Farmer Registration', status: 'Success', message: 'New farmer registered' },
    { id: 3, timestamp: '2024-04-09 08:45 AM', action: 'Application Submission', status: 'Success', message: 'Application submitted' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [filterStatus, setFilterStatus] = useState('All');

  const handleAddScheme = () => {
    setModalType('scheme');
    setFormData({});
    setShowModal(true);
  };

  const handleAddUser = () => {
    setModalType('user');
    setFormData({});
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    if (modalType === 'scheme') {
      const newScheme = { id: schemes.length + 1, ...formData, status: 'Active', applicants: 0 };
      setSchemes([...schemes, newScheme]);
    } else if (modalType === 'user') {
      const newUser = { id: users.length + 1, ...formData, joiningDate: new Date().toISOString().split('T')[0], status: 'Active' };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setFormData({});
  };

  const handleDeleteScheme = (id) => {
    if (window.confirm('Delete this scheme?')) setSchemes(schemes.filter(s => s.id !== id));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Delete this user?')) setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleStatus = (id, type) => {
    if (type === 'scheme') {
      setSchemes(schemes.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    }
  };

  const filteredUsers = filterStatus === 'All' ? users : users.filter(u => u.status === filterStatus);

  const runScraping = () => {
    alert('Starting scraping process...');
    setLogs([{ id: logs.length + 1, timestamp: new Date().toLocaleString(), action: 'Manual Scraping', status: 'In Progress', message: 'Running...' }, ...logs]);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🛠️ Admin Control Panel</h1>
        <p>Manage schemes, users, and system settings</p>
      </header>

      <main className="admin-container">
        <nav className="tab-navigation">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📊 Overview</button>
          <button className={`tab-btn ${activeTab === 'schemes' ? 'active' : ''}`} onClick={() => setActiveTab('schemes')}>📋 Schemes ({schemes.length})</button>
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Users ({users.length})</button>
          <button className={`tab-btn ${activeTab === 'scraping' ? 'active' : ''}`} onClick={() => setActiveTab('scraping')}>🔄 Scraping Logs</button>
          <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Settings</button>
        </nav>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <section className="tab-content overview-tab">
            <h2>Dashboard Overview</h2>
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon">📋</div>
                <div className="kpi-content">
                  <div className="kpi-value">{stats.totalSchemes}</div>
                  <div className="kpi-label">Total Schemes</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">👥</div>
                <div className="kpi-content">
                  <div className="kpi-value">{stats.totalUsers.toLocaleString()}</div>
                  <div className="kpi-label">Registered Farmers</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">✅</div>
                <div className="kpi-content">
                  <div className="kpi-value">{stats.totalApplications.toLocaleString()}</div>
                  <div className="kpi-label">Total Applications</div>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon">📈</div>
                <div className="kpi-content">
                  <div className="kpi-value">{stats.successRate}</div>
                  <div className="kpi-label">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <h3>🔄 Last Scraping Status</h3>
                <p><strong>Last Scrape:</strong> {stats.lastScrapeTime}</p>
                <p><strong>Frequency:</strong> {stats.scrapeFrequency}</p>
                <button className="action-btn" onClick={runScraping}>Run Scraping Now</button>
              </div>
              <div className="info-card">
                <h3>📊 Quick Stats</h3>
                <ul className="stats-list">
                  <li>Average applicants per scheme: {Math.round(stats.totalApplications / stats.totalSchemes)}</li>
                  <li>Active users today: {users.filter(u => u.status === 'Active').length}</li>
                  <li>Recent applications: {Math.floor(Math.random() * 50) + 20}</li>
                  <li>Pending approvals: {Math.floor(Math.random() * 15) + 5}</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* SCHEMES TAB */}
        {activeTab === 'schemes' && (
          <section className="tab-content schemes-tab">
            <div className="section-header">
              <h2>Manage Schemes</h2>
              <button className="add-btn" onClick={handleAddScheme}>➕ Add New Scheme</button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Scheme Name</th>
                    <th>Category</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Applicants</th>
                    <th>Budget</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.map(scheme => (
                    <tr key={scheme.id}>
                      <td><strong>{scheme.name}</strong></td>
                      <td><span className="badge category-badge">{scheme.category}</span></td>
                      <td>{scheme.source}</td>
                      <td><span className={`status-badge ${scheme.status.toLowerCase()}`}>{scheme.status}</span></td>
                      <td>{scheme.applicants.toLocaleString()}</td>
                      <td>{scheme.budget}</td>
                      <td className="actions">
                        <button className="icon-btn toggle-btn" onClick={() => handleToggleStatus(scheme.id, 'scheme')} title="Toggle">{scheme.status === 'Active' ? '⏸️' : '▶️'}</button>
                        <button className="icon-btn edit-btn" title="Edit">✏️</button>
                        <button className="icon-btn delete-btn" onClick={() => handleDeleteScheme(scheme.id)} title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <section className="tab-content users-tab">
            <div className="section-header">
              <h2>Manage Users</h2>
              <button className="add-btn" onClick={handleAddUser}>➕ Add New User</button>
            </div>
            <div className="filter-section">
              <label>Filter by Status:</label>
              <div className="filter-buttons">
                {['All', 'Active', 'Inactive'].map(status => (
                  <button key={status} className={`filter-btn ${filterStatus === status ? 'active' : ''}`} onClick={() => setFilterStatus(status)}>{status}</button>
                ))}
              </div>
              <p className="results-info">Showing {filteredUsers.length} user(s)</p>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>State</th>
                    <th>Joining Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.state}</td>
                      <td>{user.joiningDate}</td>
                      <td><span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                      <td className="actions">
                        <button className="icon-btn toggle-btn" onClick={() => handleToggleStatus(user.id, 'user')} title="Toggle">{user.status === 'Active' ? '⏸️' : '▶️'}</button>
                        <button className="icon-btn edit-btn" title="Edit">✏️</button>
                        <button className="icon-btn delete-btn" onClick={() => handleDeleteUser(user.id)} title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SCRAPING LOGS TAB */}
        {activeTab === 'scraping' && (
          <section className="tab-content scraping-tab">
            <div className="section-header">
              <h2>Scraping Logs</h2>
              <button className="action-btn" onClick={runScraping}>🔄 Run Scraping Now</button>
            </div>
            <div className="scraping-info">
              <div className="info-card">
                <h4>Last Scrape Time</h4>
                <p>{stats.lastScrapeTime}</p>
              </div>
              <div className="info-card">
                <h4>Scraping Frequency</h4>
                <p>{stats.scrapeFrequency}</p>
              </div>
              <div className="info-card">
                <h4>Total Schemes Scraped</h4>
                <p>{stats.totalSchemes}</p>
              </div>
            </div>
            <div className="logs-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td>{log.timestamp}</td>
                      <td><strong>{log.action}</strong></td>
                      <td><span className={`status-badge ${log.status.toLowerCase().replace(' ', '-')}`}>{log.status}</span></td>
                      <td>{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <section className="tab-content settings-tab">
            <h2>System Settings</h2>
            <div className="settings-grid">
              <div className="setting-card">
                <h3>🌐 Scraping Sources</h3>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> agriwelfare.gov.in</label></div>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> pmkisan.gov.in</label></div>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> pmfby.gov.in</label></div>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> myscheme.gov.in</label></div>
              </div>
              <div className="setting-card">
                <h3>📰 News Sources</h3>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> The Hindu</label></div>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> Business Standard</label></div>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> Times of India</label></div>
              </div>
              <div className="setting-card">
                <h3>📧 Email Settings</h3>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> Send scheme updates</label></div>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> Send deadline reminders</label></div>
                <div className="setting-item"><label><input type="checkbox" /> Send weekly digest</label></div>
              </div>
              <div className="setting-card">
                <h3>🔔 Notifications</h3>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> Desktop notifications</label></div>
                <div className="setting-item"><label><input type="checkbox" defaultChecked /> Mobile alerts</label></div>
                <div className="setting-item"><label><input type="checkbox" /> SMS notifications</label></div>
              </div>
            </div>
            <button className="save-btn">💾 Save Settings</button>
          </section>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{modalType === 'scheme' ? '➕ Add New Scheme' : '➕ Add New User'}</h3>
            {modalType === 'scheme' ? (
              <>
                <input type="text" placeholder="Scheme Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select Category</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Subsidy">Subsidy</option>
                  <option value="Loan">Loan</option>
                  <option value="Training">Training</option>
                </select>
                <input type="text" placeholder="Budget" value={formData.budget || ''} onChange={e => setFormData({...formData, budget: e.target.value})} />
              </>
            ) : (
              <>
                <input type="text" placeholder="Full Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="tel" placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input type="text" placeholder="State" value={formData.state || ''} onChange={e => setFormData({...formData, state: e.target.value})} />
              </>
            )}
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleModalSubmit}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
