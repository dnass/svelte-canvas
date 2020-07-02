# svelte-canvas

Reactive canvas rendering with [Svelte](https://svelte.dev/).

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

<Canvas width={640} height={640} autoclear>
  <Layer {render} />
</Canvas>
```

## API

### Canvas

`Canvas` is the top-level element. It's a Svelte wrapper around an [HTML `<canvas>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). It takes these parameters:

| parameter    | default                   | description                                                                                             |
| ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `width`      | 640                       | Canvas width                                                                                            |
| `height`     | 640                       | Canvas height                                                                                           |
| `pixelRatio` | `window.devicePixelRatio` | Canvas [pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#Examples) |
| `autoclear`  | `false`                   | If `true`, will use `context.clearRect` to clear the canvas at the start of each render cycle           |

And exposes these methods:

| method       | description                                   |
| ------------ | --------------------------------------------- |
| `getCanvas`  | Returns a reference to the canvas DOM element |
| `getContext` | Returns the canvas's 2D rendering context     |
| `redraw`     | Forces a re-render of the canvas              |

### Layer

`Layer` is a layer to be rendered onto the canvas. It takes a single prop, `render`, which is a function that receives an object with the properties `context`, `width`, and `height`. `context` is the [2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) of the parent canvas. `width` and `height` are the canvas' dimensions.

Declaring your `render` function [reactively](https://svelte.dev/docs#3_$_marks_a_statement_as_reactive) lets `svelte-canvas` re-render anytime the values that the function depends on change.

### t

`t` is a [readable store](https://svelte.dev/docs#readable) that provides the time in milliseconds since initialization. Subscribing to `t` within your render function lets you easily create animations.
