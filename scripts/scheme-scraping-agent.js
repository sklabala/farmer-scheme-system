/**
 * Scheme Scraping Agent
 * Retrieves scheme details from government URLs and newspapers
 */

require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const Scheme = require('../models/Scheme');
const Source = require('../models/Source');

class SchemeScrapingAgent {
  constructor() {
    this.governmentPortals = [
      { 
        url: 'https://agriwelfare.gov.in', 
        name: 'Agriculture Welfare Portal', 
        type: 'government',
        selectors: {
          scheme: '.scheme-card, .scheme-item, article.scheme',
          title: 'h2, h3, .scheme-title',
          description: '.scheme-desc, .description, p',
          deadline: '.deadline, .date, span.date',
          link: 'a.scheme-link, a'
        }
      },
      { 
        url: 'https://pmkisan.gov.in', 
        name: 'PM-KISAN Official', 
        type: 'government',
        selectors: {
          scheme: '.scheme, .scheme-card, div.card',
          title: 'h2, h3, .title',
          description: '.desc, p, .content',
          deadline: '.deadline, .date',
          link: 'a'
        }
      },
      { 
        url: 'https://pmfby.gov.in', 
        name: 'PM Fasal Bima Yojana', 
        type: 'government',
        selectors: {
          scheme: '.scheme, .content-card, article',
          title: 'h2, h3',
          description: 'p, .description',
          deadline: '.deadline, .date',
          link: 'a'
        }
      },
      { 
        url: 'https://www.myscheme.gov.in', 
        name: 'My Scheme India', 
        type: 'government',
        selectors: {
          scheme: '.scheme-box, .card, article',
          title: 'h2, h3, .scheme-title',
          description: '.description, p',
          deadline: '.deadline, .date',
          link: 'a'
        }
      }
    ];

    this.newspaperSources = [
      {
        url: 'https://timesofindia.indiatimes.com/india/business/search?query=farmer+scheme',
        name: 'Times of India - Farmer Schemes',
        type: 'newspaper',
        selectors: {
          article: 'article, div.article, div.news-item',
          title: 'h2, h3, .headline, a',
          description: 'p, .summary, .excerpt',
          date: '.timestamp, .date, time',
          link: 'a'
        }
      },
      {
        url: 'https://www.thehindu.com/news/national/',
        name: 'The Hindu - National News',
        type: 'newspaper',
        selectors: {
          article: 'article, div.article',
          title: 'h2, h3, a',
          description: 'p, .summary',
          date: '.timestamp, time',
          link: 'a'
        }
      },
      {
        url: 'https://www.business-standard.com/category/pib-1190101.php',
        name: 'Business Standard - PIB',
        type: 'newspaper',
        selectors: {
          article: 'article, div.article, li.article',
          title: 'h2, h3, a',
          description: 'p, .summary',
          date: '.timestamp, .date, time',
          link: 'a'
        }
      }
    ];
  }

  /**
   * Fetch and parse government portal for schemes
   */
  async scrapeGovernmentPortal(portal) {
    console.log(`\n🔍 Scraping ${portal.name}...`);
    const schemes = [];

    try {
      const response = await axios.get(portal.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      $(portal.selectors.scheme).each((index, element) => {
        try {
          const title = $(element).find(portal.selectors.title).first().text().trim();
          const description = $(element).find(portal.selectors.description).first().text().trim();
          const deadline = $(element).find(portal.selectors.deadline).first().text().trim();
          const link = $(element).find(portal.selectors.link).first().attr('href') || '';

          if (title && title.length > 0) {
            schemes.push({
              title: title.substring(0, 200),
              description: description.substring(0, 500),
              category: this.categorizeScheme(title),
              deadline: this.parseDeadline(deadline),
              sourceUrl: link.startsWith('http') ? link : new URL(link, portal.url).href,
              source: portal.name,
              sourceType: portal.type,
              eligibility: this.extractEligibility(description),
              benefits: this.extractBenefits(description),
              scrapedAt: new Date()
            });
          }
        } catch (err) {
          // Skip individual parsing errors
        }
      });

      console.log(`✅ Found ${schemes.length} schemes from ${portal.name}`);
      return schemes;
    } catch (error) {
      console.error(`❌ Error scraping ${portal.url}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch and parse newspaper for scheme-related news
   */
  async scrapeNewspaper(source) {
    console.log(`\n📰 Scraping ${source.name}...`);
    const articles = [];

    try {
      const response = await axios.get(source.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);

      $(source.selectors.article).each((index, element) => {
        try {
          const title = $(element).find(source.selectors.title).first().text().trim();
          const description = $(element).find(source.selectors.description).first().text().trim();
          const date = $(element).find(source.selectors.date).first().text().trim();
          const link = $(element).find(source.selectors.link).first().attr('href') || '';

          // Only include articles related to farmer schemes
          if (title && this.isSchemeRelated(title)) {
            articles.push({
              title: title.substring(0, 200),
              description: description.substring(0, 500),
              category: this.categorizeScheme(title),
              deadline: this.parseDeadline(description),
              sourceUrl: link.startsWith('http') ? link : new URL(link, source.url).href,
              source: source.name,
              sourceType: source.type,
              publishedDate: this.parseDate(date),
              eligibility: this.extractEligibility(description),
              benefits: this.extractBenefits(description),
              scrapedAt: new Date()
            });
          }
        } catch (err) {
          // Skip individual parsing errors
        }
      });

      console.log(`✅ Found ${articles.length} scheme-related articles from ${source.name}`);
      return articles;
    } catch (error) {
      console.error(`❌ Error scraping ${source.url}:`, error.message);
      return [];
    }
  }

  /**
   * Store schemes in database
   */
  async storeSchemes(schemes) {
    let savedCount = 0;

    for (const schemeData of schemes) {
      try {
        // Check if scheme already exists
        const existingScheme = await Scheme.findOne({
          title: schemeData.title,
          sourceUrl: schemeData.sourceUrl
        });

        if (!existingScheme) {
          const scheme = new Scheme(schemeData);
          await scheme.save();
          savedCount++;
          console.log(`✨ Saved: ${schemeData.title}`);
        } else {
          console.log(`⏭️  Already exists: ${schemeData.title}`);
        }
      } catch (error) {
        console.error(`Error saving scheme: ${error.message}`);
      }
    }

    return savedCount;
  }

  /**
   * Categorize scheme based on keywords in title
   */
  categorizeScheme(title) {
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
   * Check if content is scheme-related
   */
  isSchemeRelated(text) {
    const keywords = ['scheme', 'yojana', 'loan', 'subsidy', 'grant', 'farmer', 'kisan', 'agriculture', 'farm'];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  /**
   * Extract deadline from text
   */
  parseDeadline(text) {
    if (!text) return null;

    const datePatterns = [
      /(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/,
      /(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/,
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          return new Date(match[1]);
        } catch (e) {
          // Continue to next pattern
        }
      }
    }

    return null;
  }

  /**
   * Parse publication date from text
   */
  parseDate(text) {
    if (!text) return new Date();

    try {
      return new Date(text);
    } catch (e) {
      return new Date();
    }
  }

  /**
   * Extract eligibility criteria from description
   */
  extractEligibility(text) {
    if (!text) return [];

    const eligibility = [];
    const patterns = [
      /eligible.*?(?:\.|,)/gi,
      /requirement.*?(?:\.|,)/gi,
      /must.*?(?:\.|,)/gi,
      /should.*?(?:\.|,)/gi
    ];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        eligibility.push(...matches);
      }
    }

    return eligibility.slice(0, 5); // Limit to 5 items
  }

  /**
   * Extract benefits from description
   */
  extractBenefits(text) {
    if (!text) return [];

    const benefits = [];
    const patterns = [
      /benefit.*?(?:\.|,)/gi,
      /receive.*?(?:\.|,)/gi,
      /get.*?(?:\.|,)/gi,
      /amount.*?(?:\.|,)/gi,
      /₹[\d,]+/gi
    ];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        benefits.push(...matches);
      }
    }

    return benefits.slice(0, 5); // Limit to 5 items
  }

  /**
   * Run all scraping tasks
   */
  async runAll() {
    console.log('\n🤖 Starting Scheme Scraping Agent...\n');
    console.log('=' .repeat(60));

    let totalSaved = 0;

    // Scrape government portals
    console.log('\n📋 GOVERNMENT PORTALS');
    console.log('='.repeat(60));
    for (const portal of this.governmentPortals) {
      try {
        const schemes = await this.scrapeGovernmentPortal(portal);
        const saved = await this.storeSchemes(schemes);
        totalSaved += saved;
      } catch (error) {
        console.error(`Error processing ${portal.name}:`, error.message);
      }
    }

    // Scrape newspapers
    console.log('\n\n📰 NEWSPAPERS');
    console.log('='.repeat(60));
    for (const source of this.newspaperSources) {
      try {
        const articles = await this.scrapeNewspaper(source);
        const saved = await this.storeSchemes(articles);
        totalSaved += saved;
      } catch (error) {
        console.error(`Error processing ${source.name}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n🎉 Scraping Complete! Total new schemes saved: ${totalSaved}\n`);

    return totalSaved;
  }
}

module.exports = SchemeScrapingAgent;
