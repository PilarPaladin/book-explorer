import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://myarkived.app',
      // Include any static or dynamic routes here if they aren't automatically picked up
      dynamicRoutes: [
        '/',
        '/privacy',
        '/terms'
      ],
    }),
  ],
  build: {
    // Enable production source maps
    sourcemap: true,
    rollupOptions: {
      output: {
        // Implement manual chunking for code-splitting
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group React and React Router into their own chunk
            if (
              id.includes('react/') || 
              id.includes('react-dom/') || 
              id.includes('react-router-dom/')
            ) {
              return 'vendor-react';
            }
            
            // Group Supabase into its own chunk
            if (id.includes('@supabase/')) {
              return 'vendor-supabase';
            }

            // Fallback for all other node_modules
            return 'vendor';
          }
        },
      },
    },
  },
});
