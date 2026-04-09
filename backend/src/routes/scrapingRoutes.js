/**
 * Scraping Routes
 * Endpoints to manage scheme scraping operations
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// In-memory storage for schemes (will use database in production)
let schemeCache = [];
let lastScrapedTime = null;

/**
 * Root endpoint for scraping API
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Farmer Scheme Scraping API',
    endpoints: {
      'POST /scrape-government': 'Scrape all government portals',
      'POST /scrape-newspapers': 'Scrape newspapers for schemes',
      'GET /schemes': 'Get all scraped schemes',
      'GET /stats': 'Get scraping statistics',
      'POST /run-scheduled': 'Run scheduled scraping'
    },
    totalSchemes: schemeCache.length,
    lastScraped: lastScrapedTime
  });
});

/**
 * Scrape schemes from government portals
 */
router.post('/scrape-government', async (req, res) => {
  console.log('📋 Starting government portal scraping...');

  const governmentPortals = [
    { 
      url: 'https://agriwelfare.gov.in', 
      name: 'Agriculture Welfare Portal'
    },
    { 
      url: 'https://pmkisan.gov.in', 
      name: 'PM-KISAN Official'
    },
    { 
      url: 'https://pmfby.gov.in', 
      name: 'PM Fasal Bima Yojana'
    },
    { 
      url: 'https://www.myscheme.gov.in', 
      name: 'My Scheme India'
    }
  ];

  const scrapedSchemes = [];
  let successCount = 0;
  let errorCount = 0;

  for (const portal of governmentPortals) {
    try {
      console.log(`Scraping ${portal.name}...`);

      const response = await axios.get(portal.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract scheme information based on common HTML patterns
      $('article, div.card, div.scheme, section').slice(0, 5).each((index, element) => {
        try {
          const title = $(element).find('h2, h3, .title').first().text().trim();
          const description = $(element).find('p, .description').first().text().trim();
          const link = $(element).find('a').first().attr('href');

          if (title && title.length > 0) {
            const scheme = {
              id: `scheme-${Date.now()}-${Math.random()}`,
              title: title.substring(0, 200),
              description: description.substring(0, 300),
              source: portal.name,
              sourceUrl: link || portal.url,
              sourceType: 'government',
              category: categorizeScheme(title),
              scrapedAt: new Date(),
              verified: false
            };

            scrapedSchemes.push(scheme);
            schemeCache.push(scheme);
            successCount++;
          }
        } catch (err) {
          // Skip parsing errors
        }
      });

      console.log(`✅ Successfully scraped ${successCount} schemes from ${portal.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error scraping ${portal.name}:`, error.message);
    }
  }

  lastScrapedTime = new Date();

  res.json({
    success: true,
    message: 'Government portal scraping completed',
    totalScraped: scrapedSchemes.length,
    successCount,
    errorCount,
    schemes: scrapedSchemes.slice(0, 20), // Return first 20
    scrapedAt: lastScrapedTime
  });
});

/**
 * Scrape schemes from newspapers
 */
router.post('/scrape-newspapers', async (req, res) => {
  console.log('📰 Starting newspaper scraping...');

  const newspaperSources = [
    {
      url: 'https://www.thehindu.com/news/national/',
      name: 'The Hindu - National News'
    },
    {
      url: 'https://www.business-standard.com/',
      name: 'Business Standard'
    }
  ];

  const scrapedArticles = [];
  let successCount = 0;
  let errorCount = 0;

  for (const source of newspaperSources) {
    try {
      console.log(`Scraping ${source.name}...`);

      const response = await axios.get(source.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract news articles related to farmer schemes
      $('article, div.article, li').slice(0, 5).each((index, element) => {
        try {
          const title = $(element).find('h2, h3, a').first().text().trim();
          const description = $(element).find('p, .summary').first().text().trim();
          const link = $(element).find('a').first().attr('href');

          // Filter for scheme-related content
          if (title && isSchemeRelated(title)) {
            const article = {
              id: `article-${Date.now()}-${Math.random()}`,
              title: title.substring(0, 200),
              description: description.substring(0, 300),
              source: source.name,
              sourceUrl: link || source.url,
              sourceType: 'newspaper',
              category: categorizeScheme(title),
              scrapedAt: new Date(),
              type: 'news'
            };

            scrapedArticles.push(article);
            schemeCache.push(article);
            successCount++;
          }
        } catch (err) {
          // Skip parsing errors
        }
      });

      console.log(`✅ Successfully scraped ${successCount} articles from ${source.name}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Error scraping ${source.name}:`, error.message);
    }
  }

  lastScrapedTime = new Date();

  res.json({
    success: true,
    message: 'Newspaper scraping completed',
    totalScraped: scrapedArticles.length,
    successCount,
    errorCount,
    articles: scrapedArticles.slice(0, 20),
    scrapedAt: lastScrapedTime
  });
});

/**
 * Get all scraped schemes
 */
router.get('/schemes', (req, res) => {
  const { category, source, limit = 20 } = req.query;

  let filtered = [...schemeCache];

  if (category) {
    filtered = filtered.filter(s => s.category === category);
  }

  if (source) {
    filtered = filtered.filter(s => s.source === source || s.sourceType === source);
  }

  const schemes = filtered.slice(0, parseInt(limit));

  res.json({
    success: true,
    total: schemeCache.length,
    returned: schemes.length,
    lastScraped: lastScrapedTime,
    schemes
  });
});

/**
 * Get scraping statistics
 */
router.get('/stats', (req, res) => {
  const categories = {};
  const sources = {};

  schemeCache.forEach(scheme => {
    categories[scheme.category] = (categories[scheme.category] || 0) + 1;
    sources[scheme.source] = (sources[scheme.source] || 0) + 1;
  });

  res.json({
    success: true,
    totalSchemes: schemeCache.length,
    lastScrapedTime,
    categories,
    sources,
    breakdown: {
      government: schemeCache.filter(s => s.sourceType === 'government').length,
      newspaper: schemeCache.filter(s => s.sourceType === 'newspaper').length
    }
  });
});

/**
 * Run scheduled scraping (can be called by cron)
 */
router.post('/run-scheduled', async (req, res) => {
  console.log('⏰ Running scheduled scraping task...');

  try {
    // Simulate running both scraping tasks
    const govResponse = await axios.post('http://localhost:5001/api/scraping/scrape-government');
    const newsResponse = await axios.post('http://localhost:5001/api/scraping/scrape-newspapers');

    res.json({
      success: true,
      message: 'Scheduled scraping completed',
      government: govResponse.data.totalScraped,
      newspapers: newsResponse.data.totalScraped,
      total: govResponse.data.totalScraped + newsResponse.data.totalScraped,
      executedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Helper: Categorize scheme
 */
function categorizeScheme(title) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('insurance') || lowerTitle.includes('bima')) return 'Insurance';
  if (lowerTitle.includes('subsidy') || lowerTitle.includes('grant')) return 'Subsidy';
  if (lowerTitle.includes('loan') || lowerTitle.includes('credit')) return 'Loan';
  if (lowerTitle.includes('training') || lowerTitle.includes('skill')) return 'Training';
  if (lowerTitle.includes('equipment') || lowerTitle.includes('machinery')) return 'Equipment';
  if (lowerTitle.includes('relief') || lowerTitle.includes('damage')) return 'Relief';
  
  return 'Other';
}

/**
 * Helper: Check if content is scheme-related
 */
function isSchemeRelated(text) {
  const keywords = ['scheme', 'yojana', 'loan', 'subsidy', 'grant', 'farmer', 'kisan', 'agriculture', 'farm'];
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
}

module.exports = router;
