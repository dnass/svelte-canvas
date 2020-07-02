<script context="module">
  export const KEY = {};
</script>

<script>
  import { onMount, onDestroy, setContext } from "svelte";

  let canvas,
    context,
    layers = [],
    redrawNeeded = true;

  export let width = 640,
    height = 640,
    pixelRatio = window.devicePixelRatio,
    autoclear = false;

  export const redraw = () => (redrawNeeded = true);
  export const getCanvas = () => canvas;
  export const getContext = () => context;

  setContext(KEY, {
    register(layer) {
      layers.push(layer);
      onDestroy(() => layers.splice(layers.indexOf(layer), 1));
    },
    redraw
  });

  const draw = () => {
    if (redrawNeeded) {
      if (autoclear) {
        context.clearRect(0, 0, width, height);
      }

      for (let render of layers) {
        if (typeof render === "function") {
          render({ width, height, context });
        } else {
          throw new Error("render must be a function");
        }
      }
      redrawNeeded = false;
    }

    requestAnimationFrame(draw);
  };

  onMount(() => {
    context = canvas.getContext("2d");
    context.scale(pixelRatio, pixelRatio);

    draw();
  });

  $: width, height, redraw();
</script>

<style>
  canvas {
    display: block;
  }
</style>

<canvas
  style="width: {width}px; height: {height}px"
  width={width * pixelRatio}
  height={height * pixelRatio}
  bind:this={canvas}
  on:mouseup
  on:mousedown
  on:mousemove
  on:wheel />
<slot />
