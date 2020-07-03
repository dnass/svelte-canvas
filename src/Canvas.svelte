<script context="module">
  export const KEY = {};
</script>

<script>
  import { onMount, onDestroy, setContext } from "svelte";
  import { get } from "svelte/store";

  let canvas,
    context,
    redrawNeeded = true,
    resizeNeeded = true;

  const setups = [],
    renderers = [];

  export let width = 640,
    height = 640,
    pixelRatio = window.devicePixelRatio,
    style = null,
    autoclear = true;

  export const getCanvas = () => canvas,
    getContext = () => context,
    redraw = () => (redrawNeeded = true);

  const resize = () => (resizeNeeded = true);

  const draw = () => {
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
          const rank = get(renderer.priority);
          renderer.rank = rank || i - length;
          return renderer;
        })
        .sort((a, b) => a.rank - b.rank);

      for (let { render } of prioritized) {
        render({ context, width, height });
      }

      redrawNeeded = false;
    }

    requestAnimationFrame(draw);
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
    context = canvas.getContext("2d");
    draw();
  });

  $: width, height, resize(), redraw();
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
  on:mouseup
  on:mousedown
  on:mousemove
  on:mouseover
  on:mouseenter
  on:mouseout
  on:mouseleave
  on:click
  on:wheel />
<slot />
