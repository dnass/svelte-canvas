<script context="module" lang="ts">
  import RenderManager from '../util/renderManager';
  import { getContext as getCTX } from 'svelte';

  export const KEY = Symbol();

  interface TypedContext {
    register: RenderManager['register'];
    unregister: RenderManager['unregister'];
    redraw: RenderManager['redraw'];
  }

  export const getTypedContext = (): TypedContext => getCTX(KEY);
</script>

<script lang="ts">
  import { onMount, onDestroy, setContext } from 'svelte';
  import { browser } from '$app/environment';

  export let width = 640,
    height = 640,
    pixelRatio: number | null = null,
    style = '',
    autoclear = true;

  /** Class field. Only works for global classes. */
  let clazz = '';

  export { clazz as class, redraw, getCanvas, getContext };

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | null = null;
  let animationLoop: number;
  let layerRef: HTMLDivElement;
  let layerObserver: MutationObserver;

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

  if (pixelRatio === undefined || pixelRatio === null) {
    if (browser) {
      pixelRatio = window.devicePixelRatio;
    } else {
      pixelRatio = 2;
    }
  }

  function draw() {
    manager.render({ context: context!, width, height, pixelRatio: pixelRatio!, autoclear });
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
      const sequence = [...layerRef.children].map((layer) => {
        if (layer instanceof HTMLElement)
          return parseInt(layer.dataset.layerId ?? "-1");
        else return -1;
      });
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
  on:focus
  on:blur
  on:fullscreenchange
  on:fullscreenerror
  on:scroll
  on:cut
  on:copy
  on:paste
  on:keydown
  on:keypress
  on:keyup
  on:auxclick
  on:click
  on:contextmenu
  on:dblclick
  on:mousedown
  on:mouseenter
  on:mouseleave
  on:mousemove
  on:mouseover
  on:mouseout
  on:mouseup
  on:select
  on:wheel
  on:drag
  on:dragend
  on:dragenter
  on:dragstart
  on:dragleave
  on:dragover
  on:drop
  on:touchcancel
  on:touchend
  on:touchmove
  on:touchstart
  on:pointerover
  on:pointerenter
  on:pointerdown
  on:pointermove
  on:pointerup
  on:pointercancel
  on:pointerout
  on:pointerleave
  on:gotpointercapture
  on:lostpointercapture
  style="display: block; width: {width}px; height: {height}px;{style
    ? ` ${style}`
    : ''}"
  width={width * (pixelRatio ?? 1)}
  height={height * (pixelRatio ?? 1)}
  class={clazz}
  bind:this={canvas}
/>

<div style="display: none;" bind:this={layerRef}>
  <slot />
</div>
