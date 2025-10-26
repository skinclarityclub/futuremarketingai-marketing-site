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
    // Custom plugin to inject environment variables and fix chunk loading order
    {
      name: 'html-transform',
      transformIndexHtml: {
        order: 'post',
        handler(html, ctx) {
          // Replace environment variables
          html = html.replace(/%(\w+)%/g, (match, key) => {
            return process.env[key] || match
          })

          // In production, ensure react-core loads before other chunks
          if (mode === 'production' && ctx.bundle) {
            // Find react-core chunk
            const reactCoreChunk = Object.values(ctx.bundle).find(
              (chunk) => chunk.type === 'chunk' && chunk.fileName.includes('react-core')
            )

            if (reactCoreChunk && reactCoreChunk.type === 'chunk') {
              // Add preload for react-core at the very beginning of <head>
              const preloadTag = `<link rel="modulepreload" href="/${reactCoreChunk.fileName}" />`
              html = html.replace('<head>', `<head>\n    ${preloadTag}`)
            }
          }

          return html
        },
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
        // Force react-core to load first before ANY other chunk
        const reactCoreDep = deps.find((dep) => dep.includes('react-core'))
        if (reactCoreDep && !filename.includes('react-core')) {
          // Ensure react-core is at the beginning
          const otherDeps = deps.filter((dep) => !dep.includes('react-core'))
          return [reactCoreDep, ...otherDeps]
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
              id.match(/[\\/]node_modules[\\/]react-is[\\/]/) ||
              id.match(/[\\/]node_modules[\\/]scheduler[\\/]/)
            ) {
              return 'react-core'
            }

            // React ecosystem - depends on react-core
            if (
              id.includes('react-router') ||
              id.includes('react-i18next') ||
              id.includes('framer-motion') ||
              id.includes('zustand') ||
              id.includes('@sentry/react') ||
              id.includes('react-helmet') ||
              id.includes('react-ga4') ||
              id.includes('react-calendly') ||
              id.includes('react-cookie') ||
              id.includes('react-icons') ||
              id.includes('react-markdown') ||
              id.includes('react-use') ||
              id.includes('recharts') ||
              id.includes('@react-three')
            ) {
              return 'react-libs'
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

            // 3. Miscellaneous vendor code (non-React utilities)
            return 'vendor-misc'
          }

          // NEW: Mobile-specific components (only load on mobile)
          if (id.includes('/components/mobile/')) {
            return 'mobile-components'
          }

          // Feature-specific chunks for large pages
          if (id.includes('/pages/Calculator') || id.includes('/components/calculator/')) {
            return 'calculator-feature'
          }

          if (id.includes('/pages/Dashboard') || id.includes('/components/dashboard/')) {
            return 'dashboard-feature'
          }

          if (id.includes('/pages/Explorer') || id.includes('/components/explorer/')) {
            return 'explorer-feature'
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
