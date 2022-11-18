<script context="module" lang="ts">
  import RenderManager from '../util/renderManager';
  import { getContext as getCTX } from "svelte"
  
  export const KEY = Symbol();

  interface TypedContext {
    register: RenderManager["register"];
    unregister: RenderManager["unregister"]
    redraw: RenderManager["redraw"]
  }

  export const getTypedContext = (): TypedContext => getCTX(KEY)
</script>

<script lang="ts">
  import { onMount, onDestroy, setContext } from 'svelte';
  import { get_current_component } from 'svelte/internal';
  import { forwardEventsBuilder } from '../util/forwardEvents';

  export let width = 640,
    height = 640,
    pixelRatio: number | null = null,
    style = '',
    autoclear = true;

  export { redraw, getCanvas, getContext };

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null = null;
  let animationLoop: number;
  let layerRef: HTMLDivElement;
  let layerObserver: MutationObserver;

  const forwardEvents = forwardEventsBuilder(get_current_component());

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
    pixelRatio = 2;
  }

  function draw() {
    if (!pixelRatio) return;
    if (!context) return;
    manager.render({ context, width, height, pixelRatio, autoclear });
    animationLoop = window.requestAnimationFrame(draw);
  }

  setContext(KEY, {
    register: manager.register,
    unregister: manager.unregister,
    redraw: manager.redraw
  });

  onMount(() => {
    pixelRatio = window.devicePixelRatio;
    const browserContext = canvas.getContext('2d');
    if (!browserContext) {
      throw Error("No 2D browser context found. This shouldn't happen.");
    }
    context = browserContext;

    layerObserver = new MutationObserver(getLayerSequence);
    layerObserver.observe(layerRef, { childList: true });
    getLayerSequence();
    draw();

    function getLayerSequence() {
      const sequence = [...layerRef.children]
        // use flatmap as a casting system
        .flatMap(child => child instanceof HTMLElement ? child : [])
        .filter(layer => layer.dataset.layerId !== undefined)
        .map(
          (layer) => +(layer.dataset.layerId ?? 0)
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
