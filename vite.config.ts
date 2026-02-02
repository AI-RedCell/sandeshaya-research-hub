import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    open: true,
  },
  plugins: [
    react(),
    {
      name: 'rewrite-dashboard',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/dashboard' || req.url === '/dashboard/') {
            // Force Redirect to explicit login page
            res.writeHead(301, { Location: '/dashboard/login.html' });
            res.end();
            return;
          }
          else if (req.url === '/dashboard/index.html') {
            // Let it pass
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
