#!/usr/bin/env node
/**
 * Daily Automation Script
 * Combined scraper + deadline reminder system
 */

const { scrapeGovernmentPortals } = require('./scrape-government-schemes');

async function runDailyTasks() {
  console.log('🚀 Starting daily automation tasks...\n');

  try {
    // Task 1: Scrape government portals for new schemes
    console.log('📋 Task 1: Scraping government portals for new schemes');
    const newSchemes = await scrapeGovernmentPortals();
    console.log(`✅ Task 1 complete: ${newSchemes} new schemes discovered and saved\n`);

    // Task 2: Analyze upcoming deadlines and send notifications
    console.log('📋 Task 2: Analyzing upcoming deadlines and sending notifications');
    const notificationResults = await analyzeDeadlinesAndNotify();
    console.log('✅ Task 2 complete: Notifications processed\n');

    // Task 3: Generate admin alert
    console.log('📋 Task 3: Generating admin alert');
    await generateAdminAlert({
      newSchemes,
      notificationsSent: notificationResults.total,
      farmersNotified: notificationResults.farmersNotified
    });
    console.log('✅ Task 3 complete: Admin alert generated\n');

    console.log('\n🎉 All daily tasks completed successfully!');
    return {
      success: true,
      newSchemes,
      notificationsSent: notificationResults.total
    };

  } catch (error) {
    console.error('\n❌ Daily tasks failed:', error);
    process.exit(1);
  }
}

async function analyzeDeadlinesAndNotify() {
  const { connectDB } = require('../config/database');
  const User = require('../models/User');
  const Scheme = require('../models/Scheme');
  const Application = require('../models/Application');
  const { sendDeadlineAlert } = require('../services/smsService');

  await connectDB();

  const results = { total: 0, farmersNotified: 0 };

  try {
    // Find schemes with deadlines in next 7 days
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingSchemes = await Scheme.find({
      deadlines: { $elemMatch: { $exists: true, $lte: weekFromNow, $gte: today } },
      status: 'active'
    }).sort({ 'deadlines.end': 1 });

    console.log(`📊 Found ${upcomingSchemes.length} schemes with upcoming deadlines`);

    for (const scheme of upcomingSchemes) {
      const daysLeft = Math.ceil((new Date(scheme.deadlines.end) - today) / (1000 * 60 * 60 * 24));
      console.log(`   • ${scheme.title} (${daysLeft} days left)`);

      // Find eligible farmers who haven't applied yet
      const eligibleFarmers = await findEligibleFarmers(scheme);

      for (const farmer of eligibleFarmers) {
        try {
          // Send SMS notification
          await sendDeadlineAlert(
            farmer.phoneNumber,
            scheme.title,
            new Date(scheme.deadlines.end).toLocaleDateString('en-IN')
          );

          // Create notification record
          const notification = new Notification({
            userId: farmer._id,
            schemeId: scheme._id,
            title: 'Deadline Reminder',
            message: `Apply for ${scheme.title} before ${new Date(scheme.deadlines.end).toLocaleDateString('en-IN'}`,
            type: 'deadline_reminder',
            channel: 'sms',
            status: 'sent'
          });
          await notification.save();

          results.total++;
          results.farmersNotified++;
        } catch (error) {
          console.error(`   ❌ Failed to send to ${farmer.name}: ${error.message}`);
        }
      }
    }

    console.log(`\n📱 Notifications sent: ${results.total}`);
    return results;

  } catch (error) {
    console.error('\n❌ Deadline notification failed:', error);
    throw error;
  }
}

async function findEligibleFarmers(scheme) {
  const User = require('../models/User');

  // Build query based on scheme eligibility
  const query = {
    isActive: true,
    isVerified: true,
    phoneNumber: { $exists: true, $ne: null }
  };

  // Geographic filter
  if (scheme.state && scheme.state !== 'All India') {
    query['location.state'] = scheme.state;
  }

  // Find users who haven't applied for this scheme
  const users = await User.find(query).select('_id name phoneNumber location farmingDetails');

  const eligible = [];

  for (const user of users) {
    const alreadyApplied = await Application.findOne({
      userId: user._id,
      schemeId: scheme._id
    });

    if (!alreadyApplied && checkEligibility(user, scheme)) {
      eligible.push(user);
    }
  }

  console.log(`   👨‍🌾 Found ${eligible.length} eligible farmers for "${scheme.title}"`);
  return eligible;
}

function checkEligibility(user, scheme) {
  const userPref = user.farmingDetails;
  const schemeEligibility = scheme.eligibilityCriteria.toLowerCase();

  // Basic checks (simplified)
  if (user.location.state && scheme.state && scheme.state !== 'All India') {
    if (user.location.state !== scheme.state) return false;
  }

  // Land size check if applicable
  if (schemeEligibility.includes('small farmer') && userPref.landSize > 2) return false;
  if (schemeEligibility.includes('marginal farmer') && userPref.landSize > 1) return false;

  return true;
}

async function generateAdminAlert(summary) {
  const NodeMailer = require('nodemailer');

  const transporter = NodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const html = `
    <h2>🌾 Farmer Scheme Portal - Daily Report</h2>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <hr>
    <h3>📊 Summary</h3>
    <ul>
      <li><strong>New Schemes Found:</strong> ${summary.newSchemes}</li>
      <li><strong>Notifications Sent:</strong> ${summary.notificationsSent}</li>
      <li><strong>Farmers Notified:</strong> ${summary.farmersNotified}</li>
    </ul>
    <hr>
    <p><em>This is an automated report from Farmer Scheme Information System</em></p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: 'admin@farmerscheme.gov.in',
    subject: `Daily Report - ${new Date().toLocaleDateString()}`,
    html
  });

  console.log('   📧 Admin alert email sent');
}

// Main execution
if (require.main === module) {
  runDailyTasks()
    .then(() => {
      console.log('\n✨ All tasks completed successfully');
      process.exit(0);
    })
    .catch(err => {
      console.error('💥 Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { runDailyTasks };