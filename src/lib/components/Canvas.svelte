<script context="module">
  export const KEY = {};
</script>

<script lang="ts">
  import { onMount, onDestroy, setContext } from 'svelte';
  import forwardEventsBuilder from '../util/forwardEvents';
  import RenderManager from '../util/renderManager';

  export let width = 640,
    height = 640,
    pixelRatio: number | undefined = undefined,
    style = '',
    autoclear = true;

  export { redraw, getCanvas, getContext };

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let animationLoop: number;
  let layerRef: HTMLDivElement;
  let layerObserver: MutationObserver;

  const forwardEvents = forwardEventsBuilder();

  const manager = new RenderManager();

  function redraw() {
    manager.redraw();
  }

  function getCanvas() {
    return canvas;
  }

  function getContext() {
    return context;
  }

  if (pixelRatio === undefined) {
    if (typeof window === 'undefined') {
      pixelRatio = 2;
    } else {
      pixelRatio = window.devicePixelRatio;
    }
  }

  function draw() {
    manager.render({ context, width, height, pixelRatio, autoclear });
    animationLoop = window.requestAnimationFrame(draw);
  }

  setContext(KEY, {
    register: manager.register,
    unregister: manager.unregister,
    redraw: manager.redraw
  });

  onMount(() => {
    context = canvas.getContext('2d')!;

    layerObserver = new MutationObserver(getLayerSequence);
    layerObserver.observe(layerRef, { childList: true });
    getLayerSequence();
    draw();

    function getLayerSequence() {
      const sequence = [...layerRef.children].map(
        (layer) => +layer.dataset.layerId
      );
      manager.layerSequence = sequence;
      manager.redraw();
    }
  });

  onDestroy(() => {
    if (typeof window === 'undefined') return;
    window.cancelAnimationFrame(animationLoop);
    layerObserver.disconnect();
  });

  $: width, height, pixelRatio, autoclear, manager.resize();
</script>

<canvas
  style="display: block; width: {width}px; height: {height}px;{style
    ? ` ${style}`
    : ''}"
  width={width * (pixelRatio ?? 1)}
  height={height * (pixelRatio ?? 1)}
  bind:this={canvas}
  use:forwardEvents
/>

<div style="display: none;" bind:this={layerRef}>
  <slot />
</div>
