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
        '/',
        '/features',
        '/pricing',
        '/how-it-works',
        '/about',
        '/contact',
        '/calculator',
        '/privacy',
        '/terms',
      ],
      exclude: [
        '/demo',
        '/demo/*',
        '/explorer',
        '/dashboard',
        '/app/*',
        '/api/*',
        '/login',
        '/calculator-test',
        '/placeholder',
        '/blog',
        '/case-studies',
        '/careers',
        '/partners',
        '/documentation',
        '/legal',
        '/security',
        '/gdpr',
      ],
      readable: true,
      outDir: 'dist',
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

    // Minification settings - use esbuild instead of terser to avoid hoisting issues
    minify: 'esbuild',

    // CRITICAL: Configure module preload to ensure correct chunk load order
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Ensure react-core always loads before react-libs
        if (filename.includes('react-libs')) {
          return deps.filter((dep) => dep.includes('react-core'))
        }
        return deps
      },
    },

    // Keep terser config for reference if we need to switch back
    // terserOptions: {
    //   compress: {
    //     drop_console: mode === 'production',
    //     drop_debugger: true,
    //     pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
    //     passes: 1,
    //     unsafe_arrows: false,
    //     unsafe_methods: false,
    //     unsafe_proto: false,
    //     toplevel: false,
    //   },
    //   mangle: {
    //     safari10: true,
    //     keep_fnames: false,
    //   },
    //   format: {
    //     comments: false,
    //   },
    // },

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
        // INVERTED chunking strategy: Define what goes to SPECIFIC chunks,
        // everything else (potentially React-dependent) goes to react-libs
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // 1. Core React - MUST load first (exact matching to avoid false positives)
            if (
              id.match(/[\\/]node_modules[\\/]react[\\/]/) ||
              id.match(/[\\/]node_modules[\\/]react-dom[\\/]/) ||
              id.match(/[\\/]node_modules[\\/]react-is[\\/]/)
            ) {
              return 'react-core'
            }

            // 2. Pure non-React libraries (safe to load independently)
            // Three.js (non-React)
            if (id.includes('/three/') && !id.includes('@react-three')) {
              return 'three'
            }

            // D3 (non-React data visualization)
            if (id.includes('/d3/') || id.includes('/d3-')) {
              return 'vendor-viz'
            }

            // OpenAI SDK (non-React)
            if (id.includes('openai')) {
              return 'vendor-ai'
            }

            // Utility libraries (non-React)
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-utils'
            }

            // Animation libraries (non-React: GSAP is pure JS)
            if (id.includes('gsap')) {
              return 'vendor-animation'
            }

            // i18next core (non-React)
            if (id.includes('i18next') && !id.includes('react-i18next')) {
              return 'vendor-i18n'
            }

            // Sentry core (non-React)
            if (id.includes('@sentry') && !id.includes('@sentry/react')) {
              return 'vendor-monitoring'
            }

            // Web vitals (non-React)
            if (id.includes('web-vitals')) {
              return 'vendor-vitals'
            }

            // 3. EVERYTHING ELSE goes to react-libs (assumes React dependency)
            // This includes: react-*, framer-motion, recharts, zustand, etc.
            return 'react-libs'
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
