// src/types.d.ts
export {};

declare global {
  interface Window {
    ecospace: {
      launchByIntent: (intent: string, input: string, entities?: Record<string, string>) => void;
    };
  }
}
