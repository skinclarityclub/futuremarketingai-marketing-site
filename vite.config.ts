/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Sitemap generation for SEO - Marketing pages only
    sitemap({
      hostname: 'https://futuremarketingai.com',
      dynamicRoutes: [
        // Core marketing pages
        {
          url: '/',
          changefreq: 'daily',
          priority: 1.0,
          lastmod: new Date(),
        },
        {
          url: '/features',
          changefreq: 'weekly',
          priority: 0.9,
        },
        {
          url: '/pricing',
          changefreq: 'weekly',
          priority: 0.9,
        },
        {
          url: '/how-it-works',
          changefreq: 'weekly',
          priority: 0.8,
        },
        {
          url: '/about',
          changefreq: 'monthly',
          priority: 0.7,
        },
        {
          url: '/contact',
          changefreq: 'monthly',
          priority: 0.7,
        },
        // Utility pages
        {
          url: '/calculator',
          changefreq: 'monthly',
          priority: 0.6,
        },
        // Legal pages
        {
          url: '/privacy',
          changefreq: 'yearly',
          priority: 0.3,
        },
        {
          url: '/terms',
          changefreq: 'yearly',
          priority: 0.3,
        },
      ],
      exclude: [
        // Exclude demo app (separate from marketing)
        '/demo',
        '/demo/*',
        '/explorer',
        '/dashboard',
        // Exclude platform routes (behind authentication)
        '/app/*',
        '/api/*',
        '/login',
        // Exclude test/placeholder pages
        '/calculator-test',
        '/placeholder',
        '/blog', // Not launched yet
        '/case-studies', // Not launched yet
        '/careers', // Not launched yet
        '/partners', // Not launched yet
        '/documentation', // Not launched yet
        '/legal', // Generic legal page
        '/security', // Generic security page
        '/gdpr', // Generic GDPR page
      ],
      readable: true, // Generate readable sitemap (not minified)
      outDir: 'dist', // Output to dist folder
    }),
    // Custom plugin to inject environment variables into HTML
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(/%(\w+)%/g, (match, key) => {
          return process.env[key] || match
        })
      },
    },
    // Gzip compression for production
    mode === 'production' &&
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // Only compress files > 10kb
        deleteOriginFile: false,
      }),
    // Brotli compression for production (better compression)
    mode === 'production' &&
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
      }),
    // Bundle analyzer - only in analyze mode
    mode === 'analyze' &&
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  server: {
    port: 5173,
    host: true, // Expose to local network
    open: true,
    allowedHosts: [
      '.ngrok-free.dev', // Allow all ngrok free domains
      '.ngrok.io', // Allow all ngrok paid domains
      'localhost',
    ],
  },
  build: {
    // Generate sourcemaps only in analyze mode
    sourcemap: mode === 'analyze',

    // Warn for chunks larger than 600kb
    chunkSizeWarningLimit: 600,

    // Target modern browsers for better optimization
    target: 'es2020',

    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        // Advanced optimizations
        passes: 2,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false, // Remove all comments
      },
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Optimize CSS
    cssMinify: true,

    // Rollup options for advanced bundling
    rollupOptions: {
      // Tree-shaking optimizations
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },

      output: {
        // Advanced manual chunking strategy
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // Core React libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor'
            }

            // 3D rendering (largest dependencies)
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three'
            }

            // Charts & data visualization
            if (id.includes('recharts') || id.includes('d3')) {
              return 'charts'
            }

            // Animation libraries
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'motion'
            }

            // i18n
            if (id.includes('i18next')) {
              return 'i18n'
            }

            // Analytics & monitoring
            if (id.includes('web-vitals') || id.includes('react-ga4') || id.includes('@sentry')) {
              return 'analytics'
            }

            // Utilities (PDF, clipboard, etc)
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
              return 'utils'
            }

            // Icon libraries
            if (id.includes('react-icons')) {
              return 'icons'
            }

            // All other node_modules
            return 'vendor-misc'
          }
        },

        // Optimized chunk naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: (chunkInfo) => {
          // Use shorter hashes for vendor chunks (they change less often)
          if (chunkInfo.name?.includes('vendor')) {
            return 'assets/vendor/[name]-[hash:8].js'
          }
          return 'assets/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          // Organize assets by type
          const info = assetInfo.name || ''

          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(info)) {
            return 'assets/images/[name]-[hash][extname]'
          }

          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }

          if (/\.css$/i.test(info)) {
            return 'assets/css/[name]-[hash][extname]'
          }

          return 'assets/[name]-[hash][extname]'
        },

        // Improve code splitting
        experimentalMinChunkSize: 10000, // Min 10kb chunks to reduce HTTP requests
      },
    },

    // Report compressed file sizes
    reportCompressedSize: true,

    // Increase chunk size warning limit for large libraries
    assetsInlineLimit: 4096, // Inline assets < 4kb as base64
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/e2e/**', // Exclude Playwright E2E tests
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'tests/e2e/', // Exclude Playwright E2E tests from coverage
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.test.*',
      ],
    },
  },
}))
