import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    { file: pkg.module, format: 'es' },
    { file: pkg.main, format: 'umd', name: 'SvelteCanvas' }
  ],
  plugins: [svelte(), resolve()]
};
