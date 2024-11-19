export function load({ route }) {
  const [, category, page] = route.id.split('/');

  if (category === 'examples') {
    const allFiles = import.meta.glob<string>('./*/**.svelte', {
      query: '?raw',
      import: 'default',
      eager: true,
    });

    const files = Object.entries(allFiles)
      .filter(([path]) => path.includes(`/${page}/`))
      .map(([path, content]) => [
        path.split('/').reverse()[0],
        content.replace(/\$lib/g, 'svelte-canvas'),
      ]);

    return { category, files };
  }

  return { category };
}
