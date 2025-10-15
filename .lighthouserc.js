/**
 * Lighthouse CI Configuration
 * 
 * Run with: npx @lhci/cli autorun
 * Or: npm run lighthouse
 */

module.exports = {
  ci: {
    collect: {
      // Number of times to run Lighthouse
      numberOfRuns: 3,
      
      // Start a local server (or use existing)
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173'],
      
      // Settings for Lighthouse
      settings: {
        // Use desktop preset for primary audit
        preset: 'desktop',
        
        // Specific form factors to test
        // formFactor: 'desktop', // or 'mobile'
        
        // Throttling (for mobile testing)
        // throttling: {
        //   rttMs: 40,
        //   throughputKbps: 10240,
        //   cpuSlowdownMultiplier: 1,
        // },
      },
    },
    
    assert: {
      // Assertions for CI/CD pipeline
      assertions: {
        // Performance
        'categories:performance': ['error', { minScore: 0.9 }],
        
        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.95 }],
        
        // Best Practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        
        // SEO
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        
        // Resource sizes
        'resource-summary:script:size': ['warn', { maxNumericValue: 300000 }], // 300KB
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }], // 50KB
        'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }], // 500KB
        
        // Specific audits
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        'uses-webp-images': 'warn',
        'uses-text-compression': 'warn',
        'uses-optimized-images': 'warn',
        
        // Accessibility specific
        'color-contrast': 'error',
        'image-alt': 'error',
        'button-name': 'error',
        'link-name': 'error',
        'aria-valid-attr': 'error',
        'aria-required-attr': 'error',
      },
    },
    
    upload: {
      // Optional: Upload results to Lighthouse CI server
      // target: 'temporary-public-storage',
      // Or configure your own server
    },
  },
}

