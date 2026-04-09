import React, { useState, useEffect } from 'react';

function SchemeList() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    // Mock data - in production this would come from the backend API
    const mockSchemes = [
      {
        id: 1,
        name: 'PM Kisan Samman Nidhi',
        description: 'Direct income support to farmers',
        amount: '₹6000/year',
        deadline: '2026-06-30'
      },
      {
        id: 2,
        name: 'Soil Health Card Scheme',
        description: 'Free soil testing and health cards',
        amount: 'Free',
        deadline: '2026-05-15'
      },
      {
        id: 3,
        name: 'Agricultural Infrastructure Fund',
        description: 'Financing for farm infrastructure',
        amount: 'Up to ₹100 Lakhs',
        deadline: '2026-08-31'
      },
      {
        id: 4,
        name: 'Pradhan Mantri Fasal Bima Yojana',
        description: 'Crop insurance scheme',
        amount: 'Premium subsidized',
        deadline: '2026-07-31'
      }
    ];
    
    setSchemes(mockSchemes);
    setLoading(false);
  }, []);

  const handleApplyNow = (scheme) => {
    const message = `✅ Application for "${scheme.name}" submitted successfully!\n\nYou will receive a confirmation email shortly.`;
    alert(message);
    setSelectedScheme(null);
  };

  if (loading) {
    return <div className="page-container"><p>Loading schemes...</p></div>;
  }

  return (
    <div className="page-container">
      <h2>Government Schemes for Farmers</h2>
      
      <div className="schemes-list">
        {schemes.map(scheme => (
          <div key={scheme.id} className="scheme-card">
            <h3>{scheme.name}</h3>
            <p>{scheme.description}</p>
            <div className="scheme-details">
              <span className="amount">{scheme.amount}</span>
              <span className="deadline">Deadline: {scheme.deadline}</span>
            </div>
            <button 
              onClick={() => handleApplyNow(scheme)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#FF6B6B',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#E63946';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#FF6B6B';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
              }}
            >
              ✅ Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SchemeList;
