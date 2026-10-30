import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { output: { manualChunks: { 'three-core': ['three'], 'react-core': ['react', 'react-dom'], 'motion': ['gsap', 'gsap/ScrollTrigger'] } } } },
});
