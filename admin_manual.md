# Deliverable 6: Admin Manual

## 1. Introduction

### 1.1 Purpose
This Admin Manual provides comprehensive instructions for administrators, auditors, and scheme managers to manage the Farmer Scheme Information System (FSIS). It covers all administrative functions and operational procedures.

### 1.2 Admin Roles

| Role | Permissions | Responsibilities |
|------|-------------|------------------|
| **Super Admin** | Full system access | User management, system configuration, data backup |
| **Scheme Manager** | CRUD on schemes | Create, edit, publish schemes, manage categories |
| **Application Reviewer** | View & update applications | Review applications, approve/reject, upload decisions |
| **Auditor** | Read-only access | View logs, generate reports, audit trails |
| **Notification Manager** | Send notifications | Create and send broadcasts, schedule alerts |

### 1.3 Accessing Admin Panel

**URL:** `https://admin.farmerscheme.gov.in`

**Login:**
1. Navigate to the admin URL
2. Enter admin credentials (username + password)
3. Complete 2FA if enabled
4. Click "Login"

---

## 2. Admin Dashboard

### 2.1 Dashboard Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Farmer Scheme Admin Portal                    👤 John Admin │
├─────────────────────────────────────────────────────────────┤
│ Dashboard | Users | Schemes | Applications | Reports |      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📊  Key Metrics                                            │
├─────────────────────────────────────────────────────────────┤
│  Total Users:      12,345 📈                            │
│  New (Today):      156                                    │
│  Active Schemes:   87                                     │
│  Pending Apps:     234 ⚠️                                │
│  Success Rate:     87% ✅                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📈  Recent Activity                                        │
├─────────────────────────────────────────────────────────────┤
│ • New scheme uploaded: "PM Kisan Solar Pump" 2 min ago   │
│ • 15 applications approved by Ramesh 10 min ago          │
│ • System backup completed 1 hour ago                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ⚠️  Quick Actions                                          │
├─────────────────────────────────────────────────────────────┤
│ [ Approve Pending Apps ] [ Upload New Scheme ]            │
│ [ Send Bulk SMS ] [ Generate Report ]                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Navigation Menu

**Left Sidebar:**
```
┌─────────────────────┐
│ 👤 User Management  │
│ 📂 Scheme Manager   │
│ 📝 Applications     │
│ 📢 Notifications    │
│ 📊 Reports          │
│ ⚙️ Settings         │
│ 📄 Audit Logs       │
│ 🔒 Security         │
│ 🚪 Logout           │
└─────────────────────┘
```

---

## 3. User Management

### 3.1 Viewing Users

**Path:** User Management → All Users

**Features:**
- Search by phone number, name, or state
- Filter by:
  - Verification status
  - Language preference
  - Registration date
  - Location (state/district)
- Export user list (CSV/Excel)

```
┌─────────────────────────────────────────────────────────────┐
│  Search Users: [________________________] [ Search ]      │
├─────────────────────────────────────────────────────────────┤
│  Filters:  Verified: [✓]  Unverified: [ ]                │
│            State: [All ▼]  District: [All ▼]             │
│  Export: [ CSV ] [ Excel ] [ Print ]                      │
├─────────────────────────────────────────────────────────────┤
│  #  Name       Phone        State      Status    Actions  │
├─────────────────────────────────────────────────────────────┤
│  1 Ramesh     9876543210   Maharashtra✅ Ver  [Edit][Del]│
│  2 Sita       8765432109   Tamil Nadu ⏳ Unv [Edit][Del]│
│  3 Mohan      7654321098   Karnataka ✅ Ver  [Edit][Del]│
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Editing User Profile

**Action:** Click "Edit" next to user

**Editable Fields:**
- Name
- Email
- Location (state, district, village)
- Farming details (crops, land size, irrigation)
- Language preference
- Notification preferences

**Important:** Cannot edit phone number (primary identifier)

### 3.3 User Verification

**Manual Verification:**
1. Select unverified user
2. Click "Verify User"
3. Optionally add verification notes
4. Confirm verification

**Bulk Verification:**
1. Check multiple users
2. Click "Bulk Actions" → "Verify Selected"
3. Add common notes
4. Process

### 3.4 Deactivating Users

1. Select user(s)
2. Click "Deactivate"
3. Reason (required):
   - Duplicate account
   - Fraudulent activity
   - Requested by user
   - Other (specify)
4. Confirm deactivation

**Note:** Deactivated users cannot login but their data is retained for audit.

---

## 4. Scheme Management

### 4.1 Creating New Scheme

**Path:** Scheme Manager → Add New Scheme

**Step 1: Basic Information**
```
┌─────────────────────────────────────────────────────────────┐
│  Scheme Title: [________________________________]          │
│  Description:  [________________________________________]│
│                [________________________________________]│
│  Category: [Select Category ▼]                            │
│  Provider: [Central Government ▼]                         │
└─────────────────────────────────────────────────────────────┘
```

**Step 2: Eligibility & Benefits**
```
┌─────────────────────────────────────────────────────────────┐
│  Eligibility Criteria:                                     │
│  □ Small farmer (land < 2 hectares)                       │
│  □ Large farmer (land > 2 hectares)                       │
│  □ Women farmer                                           │
│  □ SC/ST farmer                                          │
│  □ Tenant farmer                                         │
│                                                           │
│  Applicable Crops:                                        │
│  ☑ Rice  ☑ Wheat  ☐ Cotton  ☑ Sugarcane                  │
│  ☐ Vegetables  ☐ Fruits  ☐ Spices                        │
│                                                           │
│  Financial Assistance:                                    │
│  Amount: [_________]                                      │
│  Unit: [Per Acre ▼]     Currency: INR                    │
│  Details: [________________________________]            │
└─────────────────────────────────────────────────────────────┘
```

**Step 3: Geographic Scope**
```
┌─────────────────────────────────────────────────────────────┐
│  State: [Select State ▼]                                  │
│  Districts:                                               │
│  □ All districts                                          │
│  ☑ Specific districts (select below)                     │
│  Districts: [Select District 1] [Add Another]            │
│  Regions: [ ] North [ ] South [ ] East [ ] West         │
└─────────────────────────────────────────────────────────────┘
```

**Step 4: Application Process**
```
┌─────────────────────────────────────────────────────────────┐
│  Documents Required:                                      │
│  + Add Document                                          │
│  ┌─────────────────────────────────────┐                │
│  │ Name: Aadhaar Card                  │                │
│  │ Description: Copy of front & back   │                │
│  │ Mandatory: [✓]                      │                │
│  │ Format: [PDF ▼]  Max Size: 2MB     │                │
│  └─────────────────────────────────────┘                │
│                                                           │
│  Application Link: [https://________]                    │
│  Online Application: [✓]  Offline Application: [✓]     │
│                                                           │
│  Helpdesk:                                                │
│  Phone: [_________________]                               │
│  Email: [_________________]                               │
└─────────────────────────────────────────────────────────────┘
```

**Step 5: Timeline**
```
┌─────────────────────────────────────────────────────────────┐
│  Start Date: [____/____/______]                          │
│  Deadline:   [____/____/______] ⚠️ Required              │
│  Duration: [6 Months ▼]                                  │
└─────────────────────────────────────────────────────────────┘
```

**Step 6: Additional Information**
```
┌─────────────────────────────────────────────────────────────┐
│  Terms & Conditions:                                      │
│  + Add Term                                               │
│  ┌─────────────────────────────────────┐                │
│  │ Title:                            │                │
│  │ Description:                      │                │
│  └─────────────────────────────────────┘                │
│                                                           │
│  FAQ:                                                    │
│  + Add Question                                           │
│  ┌─────────────────────────────────────┐                │
│  │ Q: How to apply?                   │                │
│  │ A: Click "Apply Now" button...    │                │
│  └─────────────────────────────────────┘                │
│                                                           │
│  Tags: [Organic, Sustainable, Welfare]                  │
│  Priority: [Medium ▼]  Status: [Draft ▼]                │
└─────────────────────────────────────────────────────────────┘
```

**Step 7: Review & Publish**
- Review all entered information
- Select "Active" status to make visible to farmers
- Click "Save & Publish" or "Save as Draft"

### 4.2 Editing Schemes

1. Navigate to Scheme Manager → All Schemes
2. Search for the scheme
3. Click "Edit" in Actions column
4. Modify required fields
5. Click "Update Scheme"

**Note:** Editing a published scheme creates a new version. Old version remains accessible for existing applications.

### 4.3 Bulk Upload Schemes

Use CSV template:
```csv
title,description,category,state,eligibility,benefits,applicationLink,deadline
"PM Kisan Urja Suraksha","Solar pump subsidy","Solar","Maharashtra","Small farmer","₹50000","https://apply.com","2025-12-31"
```

**Upload:**
1. Scheme Manager → Bulk Upload
2. Download template
3. Fill in schemes
4. Upload CSV
5. Validate & import

### 4.4 Scheme Categories

**Manage Categories:**
- Path: Scheme Manager → Categories
- Add, edit, delete categories
- Set parent categories for hierarchy
- Upload category icons

Example hierarchy:
```
Agriculture
├── Irrigation
│   ├── Drip Irrigation
│   └── Sprinkler
├── Seeds
├── Solar Energy
├── Insurance
└── Subsidies
```

---

## 5. Application Management

### 5.1 Viewing Applications

**Path:** Applications → All Applications

**Filters Available:**
- Status (pending, approved, rejected, etc.)
- Scheme
- Date range
- State/district
- Farmer name/phone

```
┌─────────────────────────────────────────────────────────────┐
│  Filters: Status: [Pending ▼]  Scheme: [All ▼]           │
│  [ Apply Filters ]  [ Reset ]                             │
├─────────────────────────────────────────────────────────────┤
│  #  Farmer      Scheme        Status  Date       Actions │
├─────────────────────────────────────────────────────────────┤
│  1 Ramesh      PM Irrigation ⏳ Pending 12/03/06  [View]│
│  2 Sita        Solar Pump   ✅ Approved 12/03/05  [View]│
│  3 Mohan       Seed Subsidy 🔴 Rejected 12/03/04  [View]│
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Reviewing an Application

**Step 1: View Application Details**
Click "View" to open full application:

```
┌─────────────────────────────────────────────────────────────┐
│  Application #APP2026000123                               │
├─────────────────────────────────────────────────────────────┤
│  Farmer: Ramesh Kumar   Phone: 9876543210                │
│  Location: Maharashtra, Pune                             │
│                                                           │
│  Scheme: PM Krishi Irrigation Scheme                     │
│  Category: Irrigation                                    │
│                                                           │
│  ┌─ Uploaded Documents ──────────────────────────────┐  │
│  │ ☑ Aadhaar.pdf     [Download]    [✅ Verified]     │  │
│  │ ☑ Land Records.pdf [Download]    [⚪ Pending]     │  │
│  │ ☑ Bank Passbook.jpg[Download]    [🔴 Rejected]    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  Timeline:                                               │
│  • Applied on: 12 Mar 2026 10:30 AM                     │
│  • Document verified: 12 Mar 2026 2:00 PM               │
│                                                            │
│  Eligibility Score: 85/100                               │
│  Remarks: Documents are in order. Proceed to approve.  │
│                                                           │
│  [ Approve ] [ Reject ] [ Request More Docs ]           │
└─────────────────────────────────────────────────────────────┘
```

**Step 2: Review Documents**
- Click "Download" to view uploaded documents
- Verify authenticity
- Check completeness

**Step 3: Document Verification**
For each document:
- [ ] Mark as Verified
- [ ] Mark as Rejected (with reason)
- [ ] Request re-upload (farmer gets notification)

**Step 4: Decision**

**Approve:**
1. Click "Approve"
2. Add remarks (optional)
3. Select approval type:
   - Approved (full)
   - Approved in Principle (subject to conditions)
4. Confirm

**Reject:**
1. Click "Reject"
2. Select rejection reason (mandatory):
   - Incomplete documents
   - Not eligible
   - Invalid documents
   - Other (specify)
3. Add detailed explanation
4. Submit rejection

**Request More Documents:**
1. Click "Request More Docs"
2. List required documents
3. Set deadline for upload
4. Send notification to farmer

### 5.3 Bulk Processing

1. Filter applications (e.g., all "Pending" in a scheme)
2. Select batch (checkbox on left)
3. Choose action:
   - Bulk Approve
   - Bulk Reject
   - Change Status
4. Confirm bulk operation

---

## 6. Notification Management

### 6.1 Creating Notifications

**Path:** Notifications → Create

```
┌─────────────────────────────────────────────────────────────┐
│  New Notification                                         │
├─────────────────────────────────────────────────────────────┤
│  Title: [________________________]                        │
│                                                           │
│  Message:                                                │
│  [_______________________________________________________]│
│  [_______________________________________________________]│
│  [_______________________________________________________]│
│                                                           │
│  Target Audience:                                         │
│  (○) All users                                            │
│  ( ) Specific states/districts                            │
│  ( ) Specific schemes                                     │
│  ( ) Custom filter                                        │
│                                                           │
│  States: [ Select State ▼ ]  Districts: [ Select ▼ ]     │
│  Schemes: [ Select Scheme ▼ ]                            │
│                                                           │
│  Notification Type: [General ▼]                          │
│  (Options: General, Scheme Update, Deadline, Urgent)    │
│                                                           │
│  Channels: [✓] SMS  [✓] Push  [ ] Email  [ ] WhatsApp   │
│                                                           │
│  Schedule:                                                │
│  (○) Send now                                             │
│  ( ) Schedule for later                                   │
│  Date: [____/____/______]  Time: [__:__] AM/PM          │
│                                                           │
│  [ Preview ]  [ Send Now ]                               │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Scheduled Notifications

**Create scheduled notification:**
1. Select "Schedule for later"
2. Set date and time
3. Notification appears in "Scheduled" list
4. Can edit or cancel before send time

**View Scheduled:**
- Path: Notifications → Scheduled
- Shows pending scheduled messages
- Can edit or cancel

### 6.3 Notification History

- Path: Notifications → History
- Filter by date, type, channel
- View delivery status (sent/failed)
- Export report

---

## 7. Reports & Analytics

### 7.1 Standard Reports

#### User Statistics
```
Path: Reports → User Analytics

- Total registered users
- Daily/weekly/monthly growth
- Language distribution
- State-wise breakdown
- Device usage (mobile/web)
- Export: CSV, PDF, Excel
```

#### Scheme Performance
```
Path: Reports → Scheme Analytics

For each scheme:
- Total views
- Applications received
- Approval rate
- Average processing time
- Popular districts
- Export available
```

#### Application Status Report
```
Path: Reports → Application Status

Filters:
- Date range
- Scheme
- Status
- State

Output:
- Total applications
- Status distribution (pie chart)
- Processing time metrics
- Rejection reasons analysis
```

#### Notification Delivery Report
```
Path: Reports → Notification Analytics

- Sent count
- Delivery rate (SMS/Push)
- Read rate (push notifications)
- Click-through rate (if applicable)
```

### 7.2 Custom Reports

**Saving Custom Reports:**
1. Apply desired filters
2. Click "Save as Template"
3. Name the template
4. Set for auto-generation (optional)

**Scheduled Reports:**
- Set up email delivery (daily/weekly/monthly)
- Recipients list
- Format (PDF/Excel)

---

## 8. System Configuration

### 8.1 Settings → General

```
Site Name: Farmer Scheme Information System
Contact Email: admin@farmerscheme.gov.in
Helpline: 1800-XXX-XXXX
Support Hours: 9 AM - 6 PM (Mon-Sat)

Time Zone: (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
Date Format: DD/MM/YYYY
Default Language: English
```

### 8.2 SMS Configuration

```
Provider: [Twilio ▼]
Account SID: [________________]
Auth Token: [________________] (masked)
Phone Number: +91___________

Test Connection: [ Test ]
```

### 8.3 Email Configuration

```
SMTP Server: smtp.gmail.com
Port: 587
From Email: notifications@farmerscheme.gov.in
From Name: Farmer Scheme Portal
SMTP Username: [__________]
SMTP Password: [__________] (masked)
```

**Send Test Email:**
- Enter recipient email
- Click "Send Test"
- Verify delivery

### 8.4 Security Settings

```
- Enable 2FA for admins: [✓]
- Session timeout: [30] minutes
- Password policy:                                      │
  • Minimum length: [8] characters                      │
  • Require uppercase: [✓]                              │
  • Require numbers: [✓]                                │
  • Require special chars: [ ]                          │
- Login attempt limit: [5] before lockout               │
- Lockout duration: [15] minutes                        │
- API rate limiting: [✓] Enabled                       │
```

---

## 9. Audit & Logs

### 9.1 Activity Logs

**Path:** Audit Logs → Activity

**Filters:**
- Date range
- User (admin)
- Action type (create, update, delete, login)
- Resource (scheme, user, application)

**Sample Log Entry:**
```
Date        | User       | Action  | Resource         | Details
12/03/2026  | Ramesh K   | UPDATE  | Scheme #123      | Changed deadline
12/03/2026  | Sita M     | CREATE  | User #456        |Registered new farmer
12/03/2026  | John Admin | LOGIN   | Admin Account    | Successful login
```

### 9.2 Exporting Logs

1. Apply filters
2. Click "Export"
3. Choose format (CSV/JSON)
4. Download

### 9.3 Compliance Reports

**GDPR Data Export:**
- Request ID (user ID)
- Generate comprehensive data export
- Includes all user data, applications, logs

**Data Retention Policy:**
```
Keep user data for: 5 years after last activity
Archive inactive users after: 2 years
Delete audit logs after: 7 years
```

---

## 10. Backup & Recovery

### 10.1 Manual Backup

**Path:** Settings → Backup

```
[ Create Database Backup ]  (Daily recommended)
[ Create Full System Backup ] (Weekly recommended)
```

**Download Backup:**
- Creates compressed archive
- Includes:
  - Database dump
  - Uploaded documents
  - Configuration files

**Restore:**
1. Upload backup file
2. Select restore type:
   - Full restore (overwrites everything)
   - Selective restore (choose tables)
3. Confirm and wait for completion

### 10.2 Automated Backups

Configure in Settings → Backup:
```
Enable automated backup: [✓]
Frequency: [Daily ▼]
Time: [02:00] AM
Retention: [30] days
Storage: [Local ▼] [Cloud Storage ▼]

[ Save Configuration ]
```

---

## 11. Troubleshooting

### 11.1 Common Issues

| Issue | Symptoms | Solution |
|-------|----------|----------|
| **SMS not sending** | Users don't receive OTP | 1. Check Twilio balance 2. Verify phone format 3. Check logs for error |
| **Slow performance** | Pages loading slowly | 1. Check database queries 2. Clear Redis cache 3. Scale server resources |
| **Document upload fails** | Users stuck on upload | 1. Check storage quota 2. Verify file size limits 3. Check Cloudinary config |
| **User can't login** | OTP errors | 1. Check SMS provider status 2. Verify rate limits 3. Check phone number format |
| **Push notifications failing** | No device notifications | 1. Verify Firebase credentials 2. Check device tokens 3. Test with single user |

### 11.2 Checking Logs

**Application Logs:**
- Tail real-time: `tail -f /var/log/farmer-scheme/app.log`
- Filter errors: `grep ERROR app.log`
- View today's log: `less app.log.$(date +%Y-%m-%d)`

**Database Logs:**
- MongoDB: `docker logs -f mongodb`
- Redis: `redis-cli monitor`

**Web Server (Nginx):**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 11.3 Restart Services

```bash
# Using systemd
sudo systemctl restart farmer-api
sudo systemctl restart nginx
sudo systemctl restart redis

# Using Docker Compose
docker-compose restart api
docker-compose restart nginx

# Check status
docker-compose ps
```

---

## 12. Security Best Practices

### 12.1 Administrator Responsibilities

- ✓ Use strong, unique passwords
- ✓ Enable 2FA immediately
- ✓ Never share admin credentials
- ✓ Log out when leaving station
- ✓ Report suspicious activities
- ✓ Regular password changes (90 days)

### 12.2 Access Review

**Monthly Checklist:**
- [ ] Review admin user list
- [ ] Remove inactive admins
- [ ] Check for shared accounts
- [ ] Audit privilege escalation
- [ ] Review API key usage

### 12.3 Incident Response

**Suspected Breach:**
1. Immediately change your password
2. Enable 2FA if not already
3. Contact security team
4. Review audit logs
5. Revoke suspicious sessions

**Data Leak:**
1. Contact DPO (Data Protection Officer)
2. Assess scope of exposure
3. Notify affected users (if required)
4. Implement fixes
5. Document incident

---

## 13. Contact & Support

### Internal Support

| Issue Type | Contact | SLA |
|------------|---------|-----|
| Technical Issue | tech-support@farmerscheme.gov.in | 4 hours |
| Security Incident | security@farmerscheme.gov.in | 1 hour |
| Feature Request | product@farmerscheme.gov.in | 5 days |
| General Query | admin-help@farmerscheme.gov.in | 24 hours |

### Emergency Hotline
For critical production issues: **1800-XXX-XXX** (24/7)

---

## 14. Quick Reference

### Frequently Used Commands

| Action | Menu Path | Shortcut |
|--------|-----------|----------|
| View pending apps | Applications → Pending | `/apps/pending` |
| Add new scheme | Scheme Manager → Add New | `/scheme/new` |
| View today's stats | Dashboard | `/` |
| Send SMS broadcast | Notifications → Create | `/notify/new` |
| Download reports | Reports → User Analytics | `/reports/users` |

### Important URLs

| Purpose | URL |
|---------|-----|
| Admin Panel | https://admin.farmerscheme.gov.in |
| API Documentation | https://api.farmerscheme.gov.in/docs |
| Monitoring Dashboard | https://grafana.farmerscheme.gov.in |
| Logs Viewer | https://logs.farmerscheme.gov.in |

---

This manual covers all administrative functions needed to operate the Farmer Scheme Information System. Keep it accessible and update when new features are added.
