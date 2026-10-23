/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STF_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
