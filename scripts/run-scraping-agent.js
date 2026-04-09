#!/usr/bin/env node

/**
 * Scheme Scraping Agent Runner
 * Executes the scraping agent to collect schemes from government portals and newspapers
 */

require('dotenv').config();
const axios = require('axios');
const SchemeScrapingAgent = require('./scheme-scraping-agent');

// Mock database store for demonstration
const schemeDatabase = [];

// Mock Scheme model for testing without MongoDB
const MockScheme = {
  findOne: async (query) => {
    return schemeDatabase.find(s => 
      s.title === query.title && s.sourceUrl === query.sourceUrl
    );
  },
  create: async (data) => {
    schemeDatabase.push(data);
    return data;
  }
};

// Override the Scheme model in the agent
const originalRequire = require.cache[require.resolve('../models/Scheme.js')];
require.cache[require.resolve('../models/Scheme.js')] = {
  exports: MockScheme
};

async function runScrapingAgent() {
  console.log('\n' + '='.repeat(70));
  console.log('🤖 FARMER SCHEME SCRAPING AGENT');
  console.log('='.repeat(70));
  console.log(`Start Time: ${new Date().toLocaleString()}\n`);

  try {
    const agent = new SchemeScrapingAgent();
    const totalSaved = await agent.runAll();

    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Total New Schemes Found: ${totalSaved}`);
    console.log(`✅ Total Schemes in Database: ${schemeDatabase.length}`);
    console.log(`⏱️  Completed At: ${new Date().toLocaleString()}`);
    console.log('='.repeat(70) + '\n');

    return totalSaved;
  } catch (error) {
    console.error('❌ Agent Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runScrapingAgent()
    .then(count => {
      console.log(`\n🎉 Scraping agent completed successfully!`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = runScrapingAgent;
