import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [mdsvex(), preprocess()],

  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: adapter(),
    paths: {
      base: '/svelte-canvas',
    },
  },
};

export default config;
