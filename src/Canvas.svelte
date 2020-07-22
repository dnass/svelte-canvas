<script context="module">
  export const KEY = {};
</script>

<script>
  import { onMount, onDestroy, setContext } from "svelte";
  import forwardEventsBuilder from "./forwardEvents";

  const forwardEvents = forwardEventsBuilder();

  let canvas,
    context,
    redrawNeeded = true,
    resizeNeeded = true;

  const setups = [],
    renderers = [];

  export let width = 640,
    height = 640,
    pixelRatio = undefined,
    style = null,
    autoclear = true;

  export const getCanvas = () => canvas,
    getContext = () => context,
    redraw = () => (redrawNeeded = true);

  const resize = () => (resizeNeeded = true);

  const draw = () => {
    if (typeof window === "undefined") {
      resizeNeeded = false;
      redrawNeeded = false;
      return;
    }

    if (resizeNeeded) {
      context.scale(pixelRatio, pixelRatio);
      resizeNeeded = false;
    }

    if (setups.length !== 0) {
      for (let setup of setups) {
        setup({ context, width, height });
        setups.splice(setups.indexOf(setup), 1);
      }

      redrawNeeded = true;
    }

    if (redrawNeeded) {
      if (autoclear) {
        context.clearRect(0, 0, width, height);
      }

      const length = renderers.length;

      const prioritized = renderers
        .map((renderer, i) => {
          const rank = renderer.priority();
          renderer.rank = rank || i - length;
          return renderer;
        })
        .sort((a, b) => a.rank - b.rank);

      for (let { render } of prioritized) {
        render({ context, width, height });
      }

      redrawNeeded = false;
    }

    window.requestAnimationFrame(draw);
  };

  const register = ({ setup, renderer }) => {
    if (setup) setups.push(setup);

    renderers.push(renderer);

    onDestroy(() => {
      renderers.splice(renderers.indexOf(renderer), 1);
      redrawNeeded = true;
    });
  };

  setContext(KEY, { register, redraw });

  onMount(() => {
    if (typeof window === "undefined") {
      pixelRatio = 2;
      return
    }
    
    if(pixelRatio === undefined) {
      pixelRatio = window.devicePixelRatio || 2;
    }

    context = canvas.getContext("2d");
    draw();
  });

  $: width, height, pixelRatio, autoclear, resize(), redraw();
</script>

<style>
  canvas {
    display: block;
  }
</style>

<canvas
  style="width: {width}px; height: {height}px;{style ? ` ${style}` : ''}"
  width={width * pixelRatio}
  height={height * pixelRatio}
  bind:this={canvas}
  use:forwardEvents />
<slot />
