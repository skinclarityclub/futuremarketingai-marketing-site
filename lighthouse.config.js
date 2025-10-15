/**
 * Lighthouse Configuration
 * Custom configuration for FutureMarketingAI performance audits
 */

module.exports = {
  extends: 'lighthouse:default',
  
  settings: {
    // Emulate mobile device for performance testing
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    
    // Only run these categories
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    
    // Skip certain audits
    skipAudits: ['uses-http2', 'redirects-http'],
  },
  
  // Budget thresholds
  budgets: [
    {
      resourceSizes: [
        {
          resourceType: 'script',
          budget: 400, // 400 KB max for JS
        },
        {
          resourceType: 'stylesheet',
          budget: 50, // 50 KB max for CSS
        },
        {
          resourceType: 'image',
          budget: 200, // 200 KB max for images
        },
        {
          resourceType: 'font',
          budget: 100, // 100 KB max for fonts
        },
        {
          resourceType: 'document',
          budget: 20, // 20 KB max for HTML
        },
        {
          resourceType: 'total',
          budget: 800, // 800 KB total initial load
        },
      ],
      resourceCounts: [
        {
          resourceType: 'script',
          budget: 15, // Max 15 scripts
        },
        {
          resourceType: 'stylesheet',
          budget: 5, // Max 5 stylesheets
        },
        {
          resourceType: 'third-party',
          budget: 10, // Max 10 third-party resources
        },
      ],
    },
  ],
};

