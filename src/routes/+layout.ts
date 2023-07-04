export const prerender = true;

const menu = {
  'Getting Started': '',
  Components: {
    Canvas: '/components/canvas',
    Layer: '/components/layer',
  },
  Examples: {
    'Hello World': '/examples/hello-world',
    'Layer Events': '/examples/layer-events',
    Scatterplot: '/examples/scatterplot',
    Globe: '/examples/globe',
    'DVD Bounce': '/examples/dvd-bounce',
    'Canvas + SVG': '/examples/canvas-svg',
    'Resizeable Layer': '/examples/resize',
  },
};

export async function load() {
  return { menu };
}
