/**
 * Government Portal Scraper
 * Checks all government URLs for new/updated agricultural schemes
 */

require('dotenv').config();
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Source = require('../models/Source');
const Scheme = require('../models/Scheme');
const { connectDB } = require('../config/database');

async function scrapeGovernmentPortals() {
  await connectDB();
  console.log('🔍 Starting government portal scraping...');

  const governmentPortals = [
    { url: 'https://agriwelfare.gov.in', name: 'agriwelfare', type: 'gov' },
    { url: 'https://pmkisan.gov.in', name: 'pmkisan', type: 'gov' },
    { url: 'https://pmfby.gov.in', name: 'pmfby', type: 'gov' },
    { url: 'https://www.myscheme.gov.in', name: 'myscheme', type: 'gov' },
    { url: 'https://kisanportal.org', name: 'kisanportal', type: 'gov' },
    { url: 'https://ysrrythubharosa.ap.gov.in', name: 'ysrrythubharosa', type: 'gov' }
  ];

  let totalNewSchemes = 0;

  for (const portal of governmentPortals) {
    try {
      console.log(`\n📊 Scraping ${portal.name}...`);

      // Update source last fetched time
      await Source.findOneAndUpdate(
        { url: portal.url },
        { lastFetchedAt: new Date(), $inc: { 'metadata.fetchCount': 1 } },
        { upsert: true, new: true }
      );

      // Fetch the page
      const response = await fetch(portal.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FarmerSchemeBot/1.0)'
        }
      });

      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch ${portal.url}: ${response.status}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract schemes based on portal structure
      const schemes = await extractSchemesFromPortal($, portal);

      // Store new schemes
      for (const schemeData of schemes) {
        const existingScheme = await Scheme.findOne({
          title: schemeData.title,
          sourceUrl: schemeData.sourceUrl
        });

        if (!existingScheme) {
          const scheme = new Scheme({
            ...schemeData,
            source: portal.name,
            sourceUrl: schemeData.sourceUrl,
            lastUpdated: new Date()
          });

          await scheme.save();
          totalNewSchemes++;
          console.log(`✨ New scheme saved: ${scheme.title}`);
        }
      }

      console.log(`✅ Finished ${portal.name}: ${schemes.length} schemes found`);
    } catch (error) {
      console.error(`❌ Error scraping ${portal.url}:`, error.message);
    }
  }

  console.log(`\n🎉 Scraping complete! Total new schemes: ${totalNewSchemes}`);
  return totalNewSchemes;
}

/**
 * Extract schemes from portal HTML based on known patterns
 */
async function extractSchemesFromPortal($, portal) {
  const schemes = [];

  try {
    switch (portal.name) {
      case 'agriwelfare':
        // Agri Welfare specific selectors
        $('div.scheme-card, div.scheme-item, article.scheme').each((_, element) => {
          const title = $(element).find('h2, h3, .scheme-title').first().text().trim();
          const description = $(element).find('.scheme-description, p.description').first().text().trim();
          const link = $(element).find('a').first().attr('href') || '';

          if (title && title.length > 5) {
            schemes.push({
              title,
              description,
              sourceUrl: new URL(link, portal.url).toString(),
              eligibilityCriteria: extractEligibility($(element)),
              benefits: extractBenefits($(element)),
              deadlines: extractDeadlines($(element)),
              category: categorizeScheme(title, description),
              state: extractState($(element)) || 'Multiple'
            });
          }
        });
        break;

      case 'pmkisan':
        // PM Kisan specific
        $('div.card, div.article, div.news-item').each((_, element) => {
          const title = $(element).find('h2, h3').first().text().trim();
          const description = $(element).find('p').first().text().trim();

          if (title.includes('PM-KISAN') || title.includes('किसान')) {
            schemes.push({
              title,
              description,
              sourceUrl: portal.url,
              eligibilityCriteria: 'Small and marginal farmers',
              benefits: '₹6000 per year in 3 installments',
              deadlines: { end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }, // Ongoing
              category: 'Subsidy',
              state: 'All India'
            });
          }
        });
        break;

      default:
        // Generic extraction for other portals
        $('article, div.card, div.scheme, div.news-item').each((_, element) => {
          const title = $(element).find('h1, h2, h3').first().text().trim();
          const description = $(element).find('p').first().text().trim();
          const link = $(element).find('a').first().attr('href') || '';

          if (title && title.length > 10 &&
              (title.toLowerCase().includes('scheme') ||
               title.toLowerCase().includes('योजना') ||
               description.toLowerCase().includes('subsidy') ||
               description.toLowerCase().includes('insurance'))) {

            schemes.push({
              title,
              description,
              sourceUrl: new URL(link, portal.url).toString(),
              eligibilityCriteria: extractEligibility($(element)) || 'Check official website',
              benefits: extractBenefits($(element)) || 'Visit link for details',
              deadlines: extractDeadlines($(element)) || {},
              category: categorizeScheme(title, description),
              state: extractState($(element)) || 'Multiple'
            });
          }
        });
        break;
    }
  } catch (error) {
    console.error(`Error in extractSchemesFromPortal for ${portal.name}:`, error.message);
  }

  return schemes;
}

/**
 * Helper extraction functions
 */
function extractEligibility($element) {
  const text = $element.text().toLowerCase();
  if (text.includes('small farmer') || text.includes('marginal farmer')) return 'Small/Marginal Farmer';
  if (text.includes('woman farmer') || text.includes('women')) return 'Women Farmer';
  if (text.includes('tenant farmer')) return 'Tenant Farmer';
  if (text.includes('sc/st') || text.includes('scheduled caste')) return 'SC/ST Farmer';
  if (text.includes('obc')) return 'OBC Farmer';
  return 'All Farmers';
}

function extractBenefits($element) {
  const text = $element.text();
  const moneyPatterns = [
    /₹\s*[\d,]+(?:\.\d+)?\s*(?:lakh|crore|thousand)?/gi,
    /Rs\.\s*[\d,]+(?:\.\d+)?/gi,
    /\$\s*[\d,]+(?:\.\d+)?/gi
  ];

  const benefits = [];
  moneyPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) benefits.push(...matches);
  });

  return benefits.length > 0 ? benefits.join(', ') : 'Financial assistance as per guidelines';
}

function extractDeadlines($element) {
  const text = $element.text();
  const datePatterns = [
    /\d{1,2}[-./]\d{1,2}[-./]\d{2,4}/g,
    /\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}/gi,
    /(?:deadline|last date|apply before|last date to apply)[^:\n]*[:\s]+([^.\n]+)/gi
  ];

  const dates = [];
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) dates.push(...matches);
  });

  // Return the earliest future date or a default
  if (dates.length > 0) {
    // Simple approach - return first found date
    return { end: new Date(dates[0]) };
  }

  return {};
}

function categorizeScheme(title, description) {
  const combined = (title + ' ' + description).toLowerCase();

  if (combined.includes('irrigation') || combined.includes('drip') || combined.includes('sprinkler')) return 'Irrigation';
  if (combined.includes('seed') || combined.includes('beej') || combined.includes('fertilizer')) return 'Seeds';
  if (combined.includes('solar') || combined.includes('solar panel') || combined.includes('surya')) return 'Solar';
  if (combined.includes('insurance') || combined.includes('bima') || combined.includes('fasal')) return 'Insurance';
  if (combined.includes('loan') || combined.includes('credit') || combined.includes('rin')) return 'Loan';
  if (combined.includes('training') || combined.includes('prashikshan') || combined.includes('training')) return 'Training';
  if (combined.includes('market') || combined.includes('mandi') || combined.includes('e-naM')) return 'Market';
  if (combined.includes('water') || combined.includes('jal')) return 'Water';
  if (combined.includes('livestock') || combined.includes('pashu') || combined.includes('dairy')) return 'Livestock';

  return 'General';
}

function extractState($element) {
  const text = $element.text();
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  for (const state of states) {
    if (text.includes(state)) return state;
  }

  return null;
}

module.exports = scrapeGovernmentPortals;