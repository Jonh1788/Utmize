import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        
    ],

<<<<<<< HEAD
   
=======
    server: {
        https: true, // Use HTTPS
        host: 'utmize.com.br',
        port: 443,
      },
      
>>>>>>> 6ab3461fc732fb3d765ed8f75fec03dd9cf85b5d
});
