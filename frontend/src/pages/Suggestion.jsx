import React, { useState } from 'react';
import './Suggestion.css';

function Suggestion() {
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    title: '',
    description: '',
    attachment: null
  });

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      category: 'Scheme Improvement',
      title: 'Better guidelines for PM Kisan',
      description: 'The application process could be simplified with step-by-step guidance.',
      status: 'Reviewed',
      date: '2024-04-05',
      rating: 4
    },
    {
      id: 2,
      name: 'Priya Singh',
      category: 'Feature Request',
      title: 'Mobile app for scheme updates',
      description: 'A mobile application would help farmers check eligibility on the go.',
      status: 'Under Review',
      date: '2024-04-03',
      rating: 5
    },
    {
      id: 3,
      name: 'Amit Patel',
      category: 'Bug Report',
      title: 'Filter not working properly',
      description: 'The category filter on the dashboard shows incorrect results.',
      status: 'Resolved',
      date: '2024-03-28',
      rating: 3
    }
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [errors, setErrors] = useState({});

  const categories = [
    'Scheme Improvement',
    'Feature Request',
    'Bug Report',
    'User Experience',
    'Documentation',
    'Other'
  ];

  const statusOptions = ['All', 'Pending', 'Under Review', 'Reviewed', 'Resolved'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData(prev => ({
        ...prev,
        attachment: file
      }));
    } else {
      alert('File size must be less than 5MB');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newSuggestion = {
        id: suggestions.length + 1,
        name: formData.name,
        email: formData.email,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        rating: 0
      };

      setSuggestions(prev => [newSuggestion, ...prev]);
      setFormData({
        name: '',
        email: '',
        category: '',
        title: '',
        description: '',
        attachment: null
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      category: '',
      title: '',
      description: '',
      attachment: null
    });
    setErrors({});
  };

  const filteredSuggestions = filterStatus === 'All' 
    ? suggestions 
    : suggestions.filter(s => s.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#FFA500';
      case 'Under Review': return '#4A90E2';
      case 'Reviewed': return '#9013FE';
      case 'Resolved': return '#50E3C2';
      default: return '#999';
    }
  };

  return (
    <div className="suggestion-page">
      <header className="suggestion-header">
        <h1>💡 Suggestions & Feedback</h1>
        <p>Help us improve the farmer scheme portal with your valuable feedback</p>
      </header>

      <main className="suggestion-container">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            ✍️ Submit Suggestion
          </button>
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 View All Suggestions ({suggestions.length})
          </button>
        </div>

        {/* SUBMISSION FORM TAB */}
        {activeTab === 'form' && (
          <div className="form-tab">
            {submitted && (
              <div className="success-message">
                ✅ Thank you! Your suggestion has been submitted successfully. We appreciate your feedback!
              </div>
            )}

            <form onSubmit={handleSubmit} className="suggestion-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error">{errors.category}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Title/Subject *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief title for your suggestion"
                    maxLength="100"
                  />
                  {errors.title && <span className="error">{errors.title}</span>}
                  <span className="char-count">{formData.title.length}/100</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your suggestion in detail..."
                    rows="6"
                    maxLength="1000"
                  />
                  {errors.description && <span className="error">{errors.description}</span>}
                  <span className="char-count">{formData.description.length}/1000</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Attachment (Optional)</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                  />
                  <small>Accepted formats: PDF, Word, Image. Max size: 5MB</small>
                  {formData.attachment && (
                    <div className="file-preview">
                      ✓ {formData.attachment.name} ({(formData.attachment.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  ✅ Submit Suggestion
                </button>
                <button type="button" onClick={handleResetForm} className="reset-btn">
                  🔄 Clear Form
                </button>
              </div>
            </form>

            <div className="tips-box">
              <h3>💡 Tips for Better Suggestions</h3>
              <ul>
                <li>Be specific and clear about your suggestion</li>
                <li>Explain why this change would be beneficial</li>
                <li>Include examples if possible</li>
                <li>One suggestion per submission for better tracking</li>
                <li>Constructive feedback is most helpful</li>
              </ul>
            </div>
          </div>
        )}

        {/* SUGGESTIONS LIST TAB */}
        {activeTab === 'list' && (
          <div className="list-tab">
            <div className="filter-section">
              <label>Filter by Status:</label>
              <div className="filter-buttons">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <p className="results-info">Showing {filteredSuggestions.length} suggestion(s)</p>
            </div>

            {filteredSuggestions.length > 0 ? (
              <div className="suggestions-list">
                {filteredSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="suggestion-card">
                    <div className="card-header">
                      <div className="title-section">
                        <h3>{suggestion.title}</h3>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(suggestion.status) }}
                        >
                          {suggestion.status}
                        </span>
                      </div>
                      <span className="category-tag">{suggestion.category}</span>
                    </div>

                    <p className="description">{suggestion.description}</p>

                    <div className="card-footer">
                      <div className="submitter-info">
                        <strong>By: {suggestion.name}</strong>
                        <small>{suggestion.email}</small>
                      </div>
                      <div className="metadata">
                        <span className="date">📅 {suggestion.date}</span>
                        <div className="rating">
                          {'⭐'.repeat(suggestion.rating || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-suggestions">
                <p>No suggestions found for this status.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <section className="faq-section">
        <h2>❓ FAQ</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Will my suggestion be reviewed?</h4>
            <p>Yes, all suggestions are reviewed by our team and you'll receive updates via email.</p>
          </div>
          <div className="faq-item">
            <h4>How long does it take to respond?</h4>
            <p>We typically respond to suggestions within 7-10 business days.</p>
          </div>
          <div className="faq-item">
            <h4>Can I remain anonymous?</h4>
            <p>No, we need your details to follow up. However, your data is kept confidential.</p>
          </div>
          <div className="faq-item">
            <h4>What if my suggestion is implemented?</h4>
            <p>We'll send you a special acknowledgment and credit on our platform.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Suggestion;
