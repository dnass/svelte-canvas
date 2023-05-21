import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { path } = params;
  const route = `../../_pages/${path}/page.svx`;

  try {
    const file = await import(/* @vite-ignore */ route);

    const { default: page, metadata } = file;

    return {
      page,
      category: path.startsWith('examples') ? 'Examples' : null,
      ...metadata,
    };
  } catch (e) {
    throw error(404);
  }
}
