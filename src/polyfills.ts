// Polyfills for Node.js globals in browser environment
// MUST be imported first in main.tsx to ensure Buffer is available before any other code runs
import { Buffer } from "buffer";

// Immediately set Buffer on all possible global objects
// This must happen synchronously before any other imports
(function setupPolyfills() {
  // Set on window
  if (typeof window !== "undefined") {
    (window as any).Buffer = Buffer;
    (window as any).global = window;
    (window as any).globalThis = window.globalThis || window;
    (window as any).globalThis.Buffer = Buffer;
    (window as any).process = { env: {} };
  }

  // Set on globalThis (works in both browser and Node.js-like environments)
  if (typeof globalThis !== "undefined") {
    (globalThis as any).Buffer = Buffer;
    (globalThis as any).global = globalThis.global || globalThis;
    (globalThis as any).process = globalThis.process || { env: {} };
  }

  // Set on global (for Node.js-style code)
  if (typeof global !== "undefined") {
    (global as any).Buffer = Buffer;
    (global as any).process = global.process || { env: {} };
  }
})();

// Export for explicit imports if needed
export { Buffer };

