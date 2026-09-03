/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMPLOYMENT_API_URL?: string
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
