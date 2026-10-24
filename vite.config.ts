import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths: works both at valkobob.github.io/Randomizer/ and on a custom domain.
  base: './',
  server: { port: 4599 },
});
