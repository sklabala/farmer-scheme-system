import React, { useState } from 'react';
import './FarmerRegistration.css';

function FarmerRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    aadhar: '',
    landHolding: '',
    cropType: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    agreeToTerms: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const cropTypes = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Onion',
    'Tomato', 'Chilli', 'Turmeric', 'Groundnut', 'Soybean', 'Pulse',
    'Vegetables', 'Fruits', 'Spices', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.village.trim()) newErrors.village = 'Village is required';
    if (!formData.aadhar.trim()) newErrors.aadhar = 'Aadhar number is required';
    else if (!/^\d{12}$/.test(formData.aadhar)) newErrors.aadhar = 'Aadhar must be 12 digits';
    if (!formData.landHolding) newErrors.landHolding = 'Land holding is required';
    if (!formData.cropType) newErrors.cropType = 'Crop type is required';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (!formData.ifsc.trim()) newErrors.ifsc = 'IFSC code is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // In production, this would send data to backend
      // await fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) })
      
      setSubmitted(true);
      
      // Log success details
      console.log('✅ Registration successful!');
      console.log('User:', `${formData.firstName} ${formData.lastName}`);
      console.log('Email:', formData.email);
      console.log('State:', formData.state);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', state: '', district: '',
          village: '', aadhar: '', landHolding: '', cropType: '', bankName: '',
          accountNumber: '', ifsc: '', agreeToTerms: false
        });
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <div className="farmer-registration">
      <header className="registration-header">
        <h1>👨‍🌾 Farmer Registration Portal</h1>
        <p>Register to access government schemes and benefits</p>
      </header>

      <main className="registration-container">
        {submitted && (
          <div className="success-message">
            ✅ Registration successful! Your account has been created. Check your email for confirmation.
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* PERSONAL INFORMATION */}
          <fieldset className="form-section">
            <legend>📋 Personal Information</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Aadhar Number *</label>
                <input
                  type="text"
                  name="aadhar"
                  value={formData.aadhar}
                  onChange={handleChange}
                  placeholder="12-digit Aadhar number"
                  maxLength="12"
                />
                {errors.aadhar && <span className="error">{errors.aadhar}</span>}
              </div>
            </div>
          </fieldset>

          {/* LOCATION INFORMATION */}
          <fieldset className="form-section">
            <legend>📍 Location Information</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label>State *</label>
                <select name="state" value={formData.state} onChange={handleChange}>
                  <option value="">Select your state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <span className="error">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label>District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter your district"
                />
                {errors.district && <span className="error">{errors.district}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Village / Town *</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Enter your village or town"
                />
                {errors.village && <span className="error">{errors.village}</span>}
              </div>
            </div>
          </fieldset>

          {/* AGRICULTURAL INFORMATION */}
          <fieldset className="form-section">
            <legend>🌾 Agricultural Information</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label>Land Holding (in acres) *</label>
                <input
                  type="number"
                  name="landHolding"
                  value={formData.landHolding}
                  onChange={handleChange}
                  placeholder="e.g., 2.5"
                  step="0.1"
                />
                {errors.landHolding && <span className="error">{errors.landHolding}</span>}
              </div>

              <div className="form-group">
                <label>Primary Crop Type *</label>
                <select name="cropType" value={formData.cropType} onChange={handleChange}>
                  <option value="">Select crop type</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
                {errors.cropType && <span className="error">{errors.cropType}</span>}
              </div>
            </div>
          </fieldset>

          {/* BANK INFORMATION */}
          <fieldset className="form-section">
            <legend>🏦 Bank Information</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label>Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Enter your bank name"
                />
                {errors.bankName && <span className="error">{errors.bankName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter your account number"
                />
                {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
              </div>

              <div className="form-group">
                <label>IFSC Code *</label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                />
                {errors.ifsc && <span className="error">{errors.ifsc}</span>}
              </div>
            </div>
          </fieldset>

          {/* TERMS & CONDITIONS */}
          <fieldset className="form-section">
            <legend>📜 Terms & Conditions</legend>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                id="terms"
              />
              <label htmlFor="terms">
                I agree to the terms and conditions and privacy policy *
              </label>
              {errors.agreeToTerms && <span className="error">{errors.agreeToTerms}</span>}
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              ✅ Register Now
            </button>
            <button type="reset" className="reset-btn">
              🔄 Clear Form
            </button>
          </div>
        </form>

        <div className="info-box">
          <h3>ℹ️ Important Information</h3>
          <ul>
            <li>Registration is free and takes only 5 minutes</li>
            <li>You will receive a confirmation email with your farmer ID</li>
            <li>Use your farmer ID to apply for schemes</li>
            <li>Keep your bank details up to date for benefit transfers</li>
            <li>For help, contact: support@farmerportal.gov.in</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default FarmerRegistration;
