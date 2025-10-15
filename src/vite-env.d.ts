/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA4_MEASUREMENT_ID: string
  readonly VITE_HOTJAR_ID: string
  readonly VITE_HOTJAR_SV: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
