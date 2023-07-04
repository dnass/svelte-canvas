import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { path } = params;
  const route = `../../_pages/${path}/page.svx`;

  try {
    const file = await import(/* @vite-ignore */ route);

    const { default: page, metadata } = file;
    const category = path.startsWith('examples')
      ? 'Examples'
      : path.startsWith('components')
      ? 'Components'
      : null;

    return {
      page,
      category,
      ...metadata,
    };
  } catch (e) {
    throw error(404);
  }
}
