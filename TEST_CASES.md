/**
 * Test Cases & Scenarios for Farmer Scheme System
 * Comprehensive testing documentation for all features
 */

# 📋 TEST CASES & SCENARIOS

## Overview
This document contains all test case scenarios for the Farmer Scheme System.
Each test case includes:
- Test ID
- Description
- Steps to execute
- Expected results
- Actual results (to be filled during testing)
- Pass/Fail status
- Screenshots path

---

## 1️⃣ FARMER LOGIN TEST CASES

### TC-Login-001: Valid Farmer Login
**Description**: Test farmer login with valid credentials
**Priority**: High
**Steps**:
1. Open http://localhost:3000/login
2. Enter email: rajesh@example.com
3. Enter password: password123
4. Click "Login" button
**Expected Result**: User redirected to Dashboard
**Test Data**: Email: rajesh@example.com, Password: password123

### TC-Login-002: Invalid Email Format
**Description**: Test login with invalid email format
**Priority**: High
**Steps**:
1. Open http://localhost:3000/login
2. Enter email: invalidemail
3. Enter password: password123
4. Click "Login" button
**Expected Result**: Error message displayed "Please enter a valid email"
**Test Data**: Email: invalidemail

### TC-Login-003: Empty Email Field
**Description**: Test login with empty email
**Priority**: High
**Steps**:
1. Open http://localhost:3000/login
2. Leave email field empty
3. Enter password: password123
4. Click "Login" button
**Expected Result**: Error message "Email is required"
**Test Data**: Email: (empty)

### TC-Login-004: Empty Password Field
**Description**: Test login with empty password
**Priority**: High
**Steps**:
1. Open http://localhost:3000/login
2. Enter email: rajesh@example.com
3. Leave password empty
4. Click "Login" button
**Expected Result**: Error message "Password is required"
**Test Data**: Password: (empty)

### TC-Login-005: Forgot Password Link
**Description**: Test forgot password link functionality
**Priority**: Medium
**Steps**:
1. Open http://localhost:3000/login
2. Click "Forgot Password?" link
3. Verify navigation to password reset page
**Expected Result**: User navigates to forgot password page

### TC-Login-006: Sign Up Link
**Description**: Test sign up link from login page
**Priority**: Medium
**Steps**:
1. Open http://localhost:3000/login
2. Click "Sign Up" link
3. Verify navigation to registration page
**Expected Result**: User navigates to registration page

---

## 2️⃣ ADMIN LOGIN TEST CASES

### TC-AdminLogin-001: Valid Admin Login
**Description**: Test admin login with valid credentials
**Priority**: High
**Steps**:
1. Open http://localhost:3000/admin-login
2. Enter username: admin
3. Enter password: admin123
4. Click "Login" button
**Expected Result**: User redirected to Admin Dashboard

### TC-AdminLogin-002: Invalid Username
**Description**: Test admin login with invalid username
**Priority**: High
**Steps**:
1. Open http://localhost:3000/admin-login
2. Enter username: invaliduser
3. Enter password: admin123
4. Click "Login" button
**Expected Result**: Error message "Invalid credentials"

### TC-AdminLogin-003: 2FA Code Input
**Description**: Test 2FA code input for admin
**Priority**: High
**Steps**:
1. Open http://localhost:3000/admin-login
2. Enter valid credentials
3. When prompted, enter 2FA code: 123456
4. Click "Verify" button
**Expected Result**: 2FA code validated and user logged in

### TC-AdminLogin-004: Admin Dashboard Access
**Description**: Test admin dashboard is accessible after login
**Priority**: High
**Steps**:
1. Login as admin
2. Verify admin dashboard loads
3. Check sidebar and menu options
**Expected Result**: Admin dashboard displays all admin features

---

## 3️⃣ FARMER REGISTRATION TEST CASES

### TC-Register-001: Complete Registration with Valid Data
**Description**: Test successful farmer registration
**Priority**: High
**Steps**:
1. Open http://localhost:3000/register
2. Fill all required fields with valid data
3. Accept terms and conditions
4. Click "Submit" button
**Expected Result**: Success message displayed "Registration successful"
**Test Data**:
- First Name: Suresh
- Last Name: Patel
- Email: suresh@example.com
- Phone: 9876543212
- State: Gujarat
- District: Surat
- Village: Test Village
- Aadhar: 123456789012
- Land Holding: 2.5 acres
- Crop Type: Cotton

### TC-Register-002: Duplicate Email
**Description**: Test registration with already registered email
**Priority**: High
**Steps**:
1. Open http://localhost:3000/register
2. Enter email: rajesh@example.com (already exists)
3. Fill other required fields
4. Click "Submit" button
**Expected Result**: Error message "Email already registered"

### TC-Register-003: Invalid Phone Number
**Description**: Test registration with invalid phone number
**Priority**: Medium
**Steps**:
1. Open http://localhost:3000/register
2. Enter phone: 12345 (less than 10 digits)
3. Fill other fields
4. Click "Submit" button
**Expected Result**: Error message "Phone must be 10 digits"

### TC-Register-004: Invalid Aadhar Number
**Description**: Test registration with invalid aadhar
**Priority**: Medium
**Steps**:
1. Open http://localhost:3000/register
2. Enter aadhar: 12345 (less than 12 digits)
3. Fill other fields
4. Click "Submit" button
**Expected Result**: Error message "Aadhar must be 12 digits"

### TC-Register-005: Missing Required Fields
**Description**: Test registration with missing required fields
**Priority**: High
**Steps**:
1. Open http://localhost:3000/register
2. Leave First Name empty
3. Click "Submit" button
**Expected Result**: Error message "First name is required"

### TC-Register-006: Terms Not Accepted
**Description**: Test registration without accepting terms
**Priority**: Medium
**Steps**:
1. Open http://localhost:3000/register
2. Fill all fields
3. Don't check "I agree to terms" checkbox
4. Click "Submit" button
**Expected Result**: Error message "You must agree to terms"

### TC-Register-007: Success Message Animation
**Description**: Test success message animation and auto-dismiss
**Priority**: Low
**Steps**:
1. Complete registration successfully
2. Observe success message for animation
3. Wait 5 seconds
**Expected Result**: Success message displays with animation and auto-dismisses

---

## 4️⃣ DASHBOARD TEST CASES

### TC-Dashboard-001: Dashboard Page Load
**Description**: Test dashboard page loads correctly
**Priority**: High
**Steps**:
1. Login as farmer
2. Navigate to dashboard
3. Verify all elements load
**Expected Result**: Dashboard displays all schemes, search bar, filters

### TC-Dashboard-002: Search Schemes by Keyword
**Description**: Test scheme search functionality
**Priority**: High
**Steps**:
1. Open Dashboard
2. Enter "Kisan" in search box
3. Press Enter or click Search
**Expected Result**: Only schemes containing "Kisan" are displayed

### TC-Dashboard-003: Filter by Category - Subsidy
**Description**: Test filter schemes by category
**Priority**: High
**Steps**:
1. Open Dashboard
2. Click "Subsidy" category button
3. Verify filtered results
**Expected Result**: Only subsidy schemes are displayed

### TC-Dashboard-004: Filter by Category - Loan
**Description**: Test filter by loan category
**Priority**: High
**Steps**:
1. Open Dashboard
2. Click "Loan" category button
3. Verify filtered results
**Expected Result**: Only loan schemes are displayed

### TC-Dashboard-005: Filter by Category - Insurance
**Description**: Test filter by insurance category
**Priority**: High
**Steps**:
1. Open Dashboard
2. Click "Insurance" category button
3. Verify filtered results
**Expected Result**: Only insurance schemes are displayed

### TC-Dashboard-006: View Scheme Details
**Description**: Test clicking on scheme to view details
**Priority**: High
**Steps**:
1. Open Dashboard
2. Click on any scheme card
3. View scheme details modal
**Expected Result**: Modal displays scheme details (name, description, eligibility, benefits, deadline)

### TC-Dashboard-007: Apply Now Button
**Description**: Test Apply Now button in scheme details
**Priority**: High
**Steps**:
1. Open scheme details modal
2. Click "Apply Now" button
3. Verify application submitted
**Expected Result**: Success message displayed "Application submitted"

### TC-Dashboard-008: Close Scheme Details Modal
**Description**: Test closing scheme details modal
**Priority**: Medium
**Steps**:
1. Open scheme details modal
2. Click "X" or click outside modal
**Expected Result**: Modal closes and dashboard is visible

### TC-Dashboard-009: Category Color Visibility
**Description**: Test category badge colors are visible
**Priority**: Medium
**Steps**:
1. Open Dashboard
2. Observe category badges on scheme cards
3. Verify colors are distinct and readable
**Expected Result**: 
- Subsidy: Red (#FF6B6B)
- Insurance: Purple (#764ba2)
- Loan: Orange (#FF8C42)
- Equipment: Cyan (#50E3C2)
- Training: Orange (#F5A623)

---

## 5️⃣ SCHEME LIST TEST CASES

### TC-SchemeList-001: View All Schemes
**Description**: Test scheme list page displays all schemes
**Priority**: High
**Steps**:
1. Navigate to /schemes
2. Verify all 8 schemes are listed
**Expected Result**: All 8 schemes display with details

### TC-SchemeList-002: Apply Now from List
**Description**: Test Apply Now button on scheme list
**Priority**: High
**Steps**:
1. Open Scheme List
2. Click "Apply Now" on any scheme
3. Verify confirmation
**Expected Result**: Confirmation message displays "Application for [Scheme] submitted!"

### TC-SchemeList-003: Scheme Sorting
**Description**: Test schemes can be sorted
**Priority**: Medium
**Steps**:
1. Open Scheme List
2. Look for sort options (if available)
3. Click sort by deadline
**Expected Result**: Schemes sorted by deadline

---

## 6️⃣ DATABASE TEST CASES

### TC-Database-001: User Data Persistence
**Description**: Test that registered user is saved in database
**Priority**: High
**Steps**:
1. Register new farmer with unique email
2. Query database to verify entry
3. Query: SELECT * FROM users WHERE email='new_email@test.com'
**Expected Result**: New user record exists in users table

### TC-Database-002: Application Data Persistence
**Description**: Test that application is saved in database
**Priority**: High
**Steps**:
1. Apply to a scheme
2. Query database: SELECT * FROM applications WHERE userId=?
**Expected Result**: New application record created with pending status

### TC-Database-003: Scheme Data Retrieval
**Description**: Test schemes load from database
**Priority**: High
**Steps**:
1. Open Dashboard
2. Verify 8 schemes are displayed
3. Check they match database: SELECT COUNT(*) FROM schemes
**Expected Result**: All 8 schemes from database are displayed

### TC-Database-004: Data Validation
**Description**: Test data is validated before saving
**Priority**: High
**Steps**:
1. Try to insert invalid data via API
2. Check database integrity
**Expected Result**: Invalid data is rejected, not saved

---

## 7️⃣ RESPONSIVE DESIGN TEST CASES

### TC-Responsive-001: Mobile View (320px)
**Description**: Test responsive design on mobile
**Priority**: Medium
**Steps**:
1. Open app on mobile or DevTools (320px width)
2. Test navigation, readability, functionality
**Expected Result**: Layout adapts correctly, all elements visible

### TC-Responsive-002: Tablet View (768px)
**Description**: Test responsive design on tablet
**Priority**: Medium
**Steps**:
1. Open app on tablet or DevTools (768px width)
2. Test layout and functionality
**Expected Result**: Layout adapts correctly for tablet

### TC-Responsive-003: Desktop View (1024px+)
**Description**: Test responsive design on desktop
**Priority**: Medium
**Steps**:
1. Open app on desktop or DevTools (1024px+ width)
2. Verify full layout
**Expected Result**: Full desktop layout displays correctly

---

## 8️⃣ API TEST CASES

### TC-API-001: Health Check Endpoint
**Description**: Test /health endpoint
**Priority**: High
**Steps**:
1. Call: curl http://localhost:5001/health
2. Verify response
**Expected Result**: Returns 200 status with message "Farmer Scheme API is running"

### TC-API-002: Get Schemes Endpoint
**Description**: Test /api/schemes endpoint
**Priority**: High
**Steps**:
1. Call: curl http://localhost:5001/api/schemes
2. Verify response format
**Expected Result**: Returns JSON array with 8 schemes

### TC-API-003: Get Farmers Endpoint
**Description**: Test /api/farmers endpoint
**Priority**: High
**Steps**:
1. Call: curl http://localhost:5001/api/farmers
2. Verify response
**Expected Result**: Returns JSON array with farmers list

### TC-API-004: API Error Handling
**Description**: Test API error responses
**Priority**: High
**Steps**:
1. Call invalid endpoint: curl http://localhost:5001/invalid
2. Check response code and message
**Expected Result**: Returns 404 error with message

---

## 9️⃣ PERFORMANCE TEST CASES

### TC-Performance-001: Dashboard Load Time
**Description**: Test dashboard page load time
**Priority**: Medium
**Steps**:
1. Open DevTools > Network tab
2. Load dashboard
3. Check load time
**Expected Result**: Page loads in < 3 seconds

### TC-Performance-002: Search Response Time
**Description**: Test search filters response time
**Priority**: Medium
**Steps**:
1. Open dashboard
2. Search for scheme
3. Check filter response time
**Expected Result**: Filter results appear in < 1 second

### TC-Performance-003: Database Query Time
**Description**: Test database query performance
**Priority**: Medium
**Steps**:
1. Query large dataset
2. Measure response time
**Expected Result**: Queries complete in < 500ms

---

## 🔟 SECURITY TEST CASES

### TC-Security-001: SQL Injection Prevention
**Description**: Test protection against SQL injection
**Priority**: High
**Steps**:
1. Try to enter SQL in form: '; DROP TABLE users; --
2. Submit form
**Expected Result**: Input is sanitized, no SQL injection occurs

### TC-Security-002: XSS Prevention
**Description**: Test protection against XSS attacks
**Priority**: High
**Steps**:
1. Try to enter JavaScript: <script>alert('xss')</script>
2. Submit form
**Expected Result**: Script tags are escaped, no code execution

### TC-Security-003: Password Hashing
**Description**: Test passwords are hashed in database
**Priority**: High
**Steps**:
1. Register user with password
2. Check database: SELECT password FROM users
**Expected Result**: Password is hashed, not plaintext

---

## Summary

| Category | Total TCs | High Priority | Medium Priority | Low Priority |
|----------|-----------|---|---|---|
| Login | 6 | 5 | 1 | 0 |
| Admin Login | 4 | 3 | 1 | 0 |
| Registration | 7 | 4 | 3 | 0 |
| Dashboard | 9 | 5 | 3 | 1 |
| Scheme List | 3 | 2 | 1 | 0 |
| Database | 4 | 4 | 0 | 0 |
| Responsive | 3 | 0 | 3 | 0 |
| API | 4 | 4 | 0 | 0 |
| Performance | 3 | 0 | 3 | 0 |
| Security | 3 | 3 | 0 | 0 |
| **TOTAL** | **46** | **30** | **15** | **1** |

**Total Test Cases: 46**
**Expected Coverage: 95%+**

---

**Notes**:
- All tests should be documented with screenshots
- Pass/Fail status should be recorded
- Test results should be saved to database
- Screenshots should be stored in `/tests/screenshots/` folder
- Each test execution should be logged with timestamp
