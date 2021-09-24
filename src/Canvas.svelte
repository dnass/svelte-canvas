<script context="module">
  export const KEY = {};
</script>

<script>
  import { onMount, onDestroy, setContext } from 'svelte';
  import forwardEventsBuilder from './forwardEvents';

  export let width = 640,
    height = 640,
    pixelRatio = undefined,
    style = null,
    autoclear = true;

  export { getCanvas, getContext, redraw };

  const forwardEvents = forwardEventsBuilder();

  let canvas, context, animationLoop, layerRef, layerObserver, layerSequence;

  let needsRedraw = true,
    needsResize = true;

  let currentLayerId = 0;

  const setups = new Map(),
    renderers = new Map();

  function getCanvas() {
    return canvas;
  }

  function getContext() {
    return context;
  }

  function redraw() {
    needsRedraw = true;
  }

  function resize() {
    needsResize = true;
  }

  function draw() {
    if (needsResize) {
      context.scale(pixelRatio, pixelRatio);
      needsResize = false;
    }

    if (setups.size !== 0) {
      for (const [layerId, setup] of setups) {
        setup({ context, width, height });
        setups.delete(layerId);
      }

      redraw();
    }

    if (needsRedraw) {
      if (autoclear) {
        context.clearRect(0, 0, width, height);
      }

      for (const layerId of layerSequence) {
        renderers.get(layerId)({ context, width, height });
      }

      needsRedraw = false;
    }

    animationLoop = window.requestAnimationFrame(draw);
  }

  function register({ setup, render }) {
    renderers.set(currentLayerId, render);

    if (setup) {
      setups.set(currentLayerId, setup);
    }

    return currentLayerId++;
  }

  function unregister(layerId) {
    renderers.delete(layerId);
    redraw();
  }

  function getLayerSequence() {
    layerSequence = [...layerRef.children].map(d => +d.dataset.layerId);
    redraw();
  }

  function observeLayers() {
    layerObserver = new MutationObserver(getLayerSequence);
    layerObserver.observe(layerRef, { childList: true });
    getLayerSequence();
  }

  setContext(KEY, { register, unregister, redraw });

  if (pixelRatio === undefined) {
    if (typeof window === 'undefined') {
      pixelRatio = 2;
    } else {
      pixelRatio = window.devicePixelRatio;
    }
  }

  onMount(() => {
    context = canvas.getContext('2d');
    observeLayers();
    draw();
  });

  onDestroy(() => {
    window.cancelAnimationFrame(animationLoop);
    layerObserver.disconnect();
  });

  $: width, height, pixelRatio, autoclear, resize(), redraw();
</script>

<canvas
  style="display: block; width: {width}px; height: {height}px;{style
    ? ` ${style}`
    : ''}"
  width={width * pixelRatio}
  height={height * pixelRatio}
  bind:this={canvas}
  use:forwardEvents
/>

<div style="display: none;" bind:this={layerRef}>
  <slot />
</div>
