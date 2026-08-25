/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STF_API_URL: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_MOCK_DELAY_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
