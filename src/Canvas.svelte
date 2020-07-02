<script context="module">
  export const KEY = {};
</script>

<script>
  import { onMount, onDestroy, setContext } from "svelte";

  let canvas,
    context,
    setups = [],
    renderers = [],
    redrawNeeded = true,
    resizeNeeded = true;

  export let width = 640,
    height = 640,
    pixelRatio = window.devicePixelRatio,
    autoclear = true;

  export const redraw = () => (redrawNeeded = true);
  export const getCanvas = () => canvas;
  export const getContext = () => context;

  setContext(KEY, {
    registerSetup(setup) {
      setups.push(setup);
    },
    registerRender(render) {
      renderers.push(render);
      onDestroy(() => {
        renderers.splice(renderers.indexOf(render), 1);
        redrawNeeded = true;
      });
    },
    redraw
  });

  const draw = () => {
    if (resizeNeeded) {
      context.scale(pixelRatio, pixelRatio);
      resizeNeeded = false;
    }

    if (setups.length) {
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

      for (let render of renderers) {
        render({ context, width, height });
      }

      redrawNeeded = false;
    }

    requestAnimationFrame(draw);
  };

  onMount(() => {
    context = canvas.getContext("2d");

    draw();
  });

  $: width, height, (resizeNeeded = true), redraw();
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
  on:mouseover
  on:mouseenter
  on:mouseout
  on:mouseleave
  on:click
  on:wheel />
<slot />
