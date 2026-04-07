const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { authorizeRoles } = require('./auth')

// Route to list applications with filtering
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const { status, schemeId, dateFrom, dateTo } = req.query;

    const query = {};
    if (status) query.status = status;
    if (schemeId) query.schemeId = schemeId;
    if (dateFrom) query.appliedAt = { $gte: new Date(dateFrom) };
    if (dateTo) query.end = { $lte: new Date(dateTo) };

    const applications = await Application.find(query)
      .sort({ appliedAt: -1 })
      .populate('schemeId', 'title')
      .limit(100);

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to approve/reject applications
router.post('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Mark as approved
    application.status = 'approved';
    application.notes.push({
      userId: req.user.id,
      message: 'Approved by admin',
      timestamp: new Date()
    });
    await application.save();

    // Send notification to user
    await Notification.create({
      userId: application.userId,
      title: 'Application Approved',
      message: `${app.title} approved by admin`,
      type: 'application_approved',
      channels: ['push']
    });

    res.json({ success: true, message: 'Application approved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to reject application
router.post('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Mark as rejected
    application.status = 'rejected';
    application.notes.push({
      userId: req.user.id,
      message: req.body.rejectReason || 'Not eligible',
      timestamp: new Date()
    });
    await application.save();

    // Update status
    await Application.updateOne({ _id: application._id }, { status: 'rejected' });

    res.json({ success: true, message: 'Application rejected' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;