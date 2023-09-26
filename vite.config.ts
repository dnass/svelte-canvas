import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import pkg from './package.json';

const config: UserConfig = {
  plugins: [sveltekit()],
  define: {
    VERSION: JSON.stringify(pkg.version),
  },
};

export default config;
