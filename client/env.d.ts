/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_BASE_API_URL: string;
    // add other env vars here as needed
  }
}
