import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Plugin to inject Buffer polyfill at the very beginning
function bufferPolyfillPlugin() {
  return {
    name: "buffer-polyfill",
    enforce: "pre" as const,
    transformIndexHtml(html: string) {
      // Inject Buffer polyfill script before the main module
      const bufferScript = `
        <script>
          if (typeof window !== 'undefined' && !window.Buffer) {
            // This will be replaced by the actual Buffer import at runtime
            // But we need to ensure the global is set up immediately
            window.global = window.global || window;
            window.globalThis = window.globalThis || window;
            window.process = window.process || { env: {} };
          }
        </script>
      `;
      return html.replace(
        '<script type="module" src="/src/main.tsx"></script>',
        bufferScript + '<script type="module" src="/src/main.tsx"></script>'
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [bufferPolyfillPlugin(), react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer",
    },
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
    include: ["buffer"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
