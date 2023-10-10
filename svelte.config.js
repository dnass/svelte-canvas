import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import pkg from './package.json' assert { type: 'json' };

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    mdsvex({
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      layout: 'src/routes/_components/Layout.svelte',
    }),
    preprocess(),
  ],

  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: adapter(),
    paths: {
      base: '/svelte-canvas',
    },
    version: {
      name: pkg.version,
    },
  },
};

export default config;
