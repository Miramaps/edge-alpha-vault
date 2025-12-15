import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

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
    proxy: {
      // Forward API calls to local backend during development
      '/join-edge': {
        target: process.env.API_SERVER || 'http://localhost:3001',
        changeOrigin: true,
      },
      // Only proxy the API endpoint used by the admin UI to avoid
      // colliding with the client-side `/admin` route which must
      // be served by the Vite dev server.
      '/admin/update-status': {
        target: process.env.API_SERVER || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/verify': {
        target: process.env.API_SERVER || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/webhooks': {
        target: process.env.API_SERVER || 'http://localhost:3001',
        changeOrigin: true,
      }
    },
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
