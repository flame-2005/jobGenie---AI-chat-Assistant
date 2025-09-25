import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Different entry points for web vs extension
      input: mode === 'extension' 
        ? { popup: resolve(__dirname, 'popup.html') }  // Extension build
        : { main: resolve(__dirname, 'index.html') },  // Web build
      output: {
        // Control how files are named
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    // Different output folders
    outDir: mode === 'extension' ? 'dist-extension' : 'dist'
  }
}));