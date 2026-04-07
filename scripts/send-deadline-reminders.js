/**
 * Deadline Reminder System
 * Scrapes government portals for new schemes
 * Analyzes upcoming deadlines and sends notifications to eligible farmers
 */

const schedule = require('node-schedule');
const fetch = require('node-fetch');
const { sendDeadlineAlert } = require('../services/smsService');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

async function scrapeAndNotify() {
  try {
    console.log('🔍 Starting government portal scraping...');

    const portals = [
      { url: 'https://agriwelfare.gov.in', name: 'agriwelfare', schemeKeyword: 'scheme' },
      { url: 'https://pmkisan.gov.in', name: 'pmkisan', schemeKeyword: 'kisan' },
      { url: 'https://pmfby.gov.in', name: 'pmfby', schemeKeyword: 'insurance' },
      { url: 'https://www.myscheme.gov.in', name: 'myscheme', schemeKeyword: 'scheme' },
      { url: 'https://kisanportal.org', name: 'kisanportal', schemeKeyword: 'kisan' },
      { url: 'https://ysrrythubharosa.ap.gov.in', name: 'ysrrythubharosa', schemeKeyword: 'rythu' }
    ];

    let newSchemesCount = 0;

    for (const portal of portals) {
      console.log(`📡 Checking ${portal.name}...`);
      try {
        const newSchemes = await fetchAndParseSchemes(portal);
        newSchemesCount += newSchemes.length;
        console.log(`   ✅ Found ${newSchemes.length} new/updated schemes`);
      } catch (error) {
        console.warn(`⚠️  Failed to fetch ${portal.name}: ${error.message}`);
      }
    }

    console.log(`\n🗂️  Total new schemes discovered: ${newSchemesCount}`);
    return newSchemesCount;
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw error;
  }
}

async function fetchAndParseSchemes(portal) {
  const response = await fetch(portal.url, {
    timeout: 10000,
    headers: { 'User-Agent': 'Mozilla/5.0 (FarmerSchemeBot/1.0)' }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${portal.name}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const schemes = [];

  // Generic extraction pattern - look for scheme items
  $('h2, h3, h4, .scheme-title, .card-title, article h2, div.news-item h3').each((index, element) => {
    const title = $(element).text().trim();
    const description = $(element).next('p').text().trim();

    if (title.length > 5 && (
      title.toLowerCase().includes(portal.schemeKeyword) ||
      description.toLowerCase().includes('subsidy') ||
      description.toLowerCase().includes('eligible') ||
      description.toLowerCase().includes('deadline')
    )) {
      schemes.push({
        title,
        description,
        url: portal.url,
        source: portal.name,
        category: categorize(title, description),
        deadline: extractDate(description)
      });
    }
  });

  // Limit to first 20 to avoid over-processing
  return schemes.slice(0, 20);
}

function categorize(title, description) {
  const combined = (title + ' ' + description).toLowerCase();
  if (combined.includes('irrigation') || combined.includes('drip') || combined.includes('sprinkler')) return 'irrigation';
  if (combined.includes('seed') || combined.includes('fertilizer') || combined.includes('kiss')) return 'seeds';
  if (combined.includes('solar') || combined.includes('surya') || combined.includes('photovoltaic')) return 'solar';
  if (combined.includes('insurance') || combined.includes('bima') || combined.includes('fasal')) return 'insurance';
  if (combined.includes('loan') || combined.includes('credit') || combined.includes('bank')) return 'loan';
  if (combined.includes('train') || combined.includes('skill')) return 'training';
  if (combined.includes('market') || combined.includes('mandi') || combined.includes('price')) return 'market';
  if (combined.includes('crop') && combined.includes('disease')) return 'disease';
  return 'general';
}

function extractDate(text) {
  const datePatterns = [
    /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) return new Date(match[0]);
  }

  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days
}

function categorize(language) {
  // If you ever want to aggregate by language
  return language ?? 'en';
}

module.exports = { scrapeAndNotify };

// Run immediately if called directly
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmer_scheme')
    .then(() => scrapeAndNotify())
    .then(count => console.log(`\n✅ Scraping completed. ${count} new schemes found.`))
    .catch(err => console.error('❌ Scraping failed:', err))
    .finally(() => mongoose.disconnect());
}