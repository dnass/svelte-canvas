export const prerender = true;

const menu = {
  'Getting started': '',
  Components: {
    Canvas: '/components/canvas',
    Layer: '/components/layer',
  },
  Examples: {
    'Hello world': '/examples/hello-world',
    'Reactive render': '/examples/reactive-render',
    'Layer events': '/examples/layer-events',
    Scatterplot: '/examples/scatterplot',
    Globe: '/examples/globe',
    'DVD bounce': '/examples/dvd-bounce',
    'Canvas + SVG': '/examples/canvas-svg',
    'Resizeable layer': '/examples/resize',
  },
};

export async function load() {
  return { menu };
}
