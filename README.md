# svelte-canvas

Reactive canvas rendering with Svelte.

## Installation

`npm install svelte svelte-canvas`

## Usage

```
<script>
  import { Canvas, Layer, t } from "svelte-canvas";

  $: render = ({ context, width, height }) => {
    context.fillStyle = `hsl(${$t / 40}, 100%, 50%)`;
    context.beginPath();
    context.arc(($t / 4) % width, ($t / 4) % height, 100, 0, Math.PI * 2);
    context.fill();
  };
</script>

<Canvas width={640} height={640}>
  <Layer {render} />
</Canvas>
```

More examples:

- [Scatterplot](https://svelte.dev/repl/8265c051bf754f8aba6f5d6ed9d0d74f)
- [Globe](https://svelte.dev/repl/b0c3901c51cd49f1a2f337f731942269)
- [Trefoil](https://svelte.dev/repl/44d1eb4677e2421ab20a584ca8a0a934)
- [DVD screensaver](https://svelte.dev/repl/34d79dea30b8428590b8cb76221ca1d4)

## API

### Canvas

`Canvas` is the top-level element. It's a Svelte wrapper around an [HTML `<canvas>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas).

#### Parameters

| parameter    | default                   | description                                                                                             |
| ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `width`      | 640                       | Canvas width                                                                                            |
| `height`     | 640                       | Canvas height                                                                                           |
| `pixelRatio` | `window.devicePixelRatio` | Canvas [pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#Examples) |
| `style`      | `null`                    | A CSS style string which will be applied to the canvas element                                          |
| `autoclear`  | `true`                    | If `true`, will use `context.clearRect` to clear the canvas at the start of each render cycle           |

#### Methods

| method       | description                                   |
| ------------ | --------------------------------------------- |
| `getCanvas`  | Returns a reference to the canvas DOM element |
| `getContext` | Returns the canvas's 2D rendering context     |
| `redraw`     | Forces a re-render of the canvas              |

#### Events

All DOM events on the `<canvas>` element are forwarded to the `Canvas` component, so [handling an event](https://svelte.dev/docs#Element_directives) is as simple as `<Canvas on:click={handleClick}>`.

### Layer

`Layer` is a layer to be rendered onto the canvas. It takes three props: `setup`, `render`, and `priority`. `setup` and `render` both require functions with one argument, that receives an object with the properties `context`, `width`, and `height`. `context` is the [2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) of the parent canvas. `width` and `height` are the canvas's dimensions.

`setup` is optional and is called once at initialization. `render` is called every time the canvas redraws.

Declaring your `render` function [reactively](https://svelte.dev/docs#3_$_marks_a_statement_as_reactive) lets `svelte-canvas` re-render anytime the values that the function depends on change.

The third prop, `priority`, takes a positive integer which determines the layer's render priority. Layers with a `priority` will be rendered _after_ other layers, in ascending order of priority, so that higher priority layers appear on top of the scene.

### t

`t` is a [readable store](https://svelte.dev/docs#readable) that provides the time in milliseconds since initialization. Subscribing to `t` within your render function lets you easily create animations.
