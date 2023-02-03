<script context="module" lang="ts">
  import LayerManager from '$lib/util/LayerManager';
  import { getContext as getCTX } from 'svelte';

  export const KEY = Symbol();

  interface TypedContext {
    register: LayerManager['register'];
    unregister: LayerManager['unregister'];
    redraw: LayerManager['redraw'];
  }

  export const getTypedContext = (): TypedContext => getCTX(KEY);
</script>

<script lang="ts">
  import {
    createContextProxy,
    type ContextProxy
  } from '$lib/util/contextProxy';
  import { onMount, onDestroy, setContext } from 'svelte';

  export let width = 640,
    height = 640,
    pixelRatio: number | null = null,
    style = '',
    autoclear = true,
    layerEvents = true;

  /** Class field. Only works for global classes. */
  let clazz = '';

  export { clazz as class, redraw, getCanvas, getContext };

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | ContextProxy | null = null;
  let animationLoop: number;
  let layerRef: HTMLDivElement;
  let layerObserver: MutationObserver;

  const manager = new LayerManager();

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
    if (typeof window !== 'undefined') {
      pixelRatio = window.devicePixelRatio;
    } else {
      pixelRatio = 2;
    }
  }

  function draw() {
    manager.render({
      context: context!,
      width,
      height,
      pixelRatio: pixelRatio!,
      autoclear
    });
    animationLoop = window.requestAnimationFrame(draw);
  }

  setContext(KEY, {
    register: manager.register,
    unregister: manager.unregister,
    redraw: manager.redraw
  });

  onMount(() => {
    const ctx = canvas.getContext('2d')!;

    if (layerEvents) {
      context = createContextProxy(ctx);
      context._renderingLayerId = manager.getRenderingLayerId;
    } else {
      context = ctx;
    }

    layerObserver = new MutationObserver(getLayerSequence);
    layerObserver.observe(layerRef, { childList: true });
    getLayerSequence();
    draw();

    function getLayerSequence() {
      const sequence = [...layerRef.children].map((layer) => {
        if (layer instanceof HTMLElement)
          return parseInt(layer.dataset.layerId ?? '-1');
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

  const handleLayerEvent = (e: MouseEvent | TouchEvent) => {
    if (!layerEvents) return;

    if (
      e instanceof MouseEvent &&
      (e.type === 'pointermove' || e.type === 'mousemove')
    ) {
      const { offsetX: x, offsetY: y } = e;
      const id = (context as ContextProxy)?._getLayerIdAtPixel(x, y);
      manager.setActiveLayer(id, e);
    }

    manager.dispatchLayerEvent(e);
  };

  $: width, height, pixelRatio, autoclear, manager.resize();

  $: (context as ContextProxy)?._setCanvasSize?.(width, height);
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
  on:click={handleLayerEvent}
  on:contextmenu={handleLayerEvent}
  on:dblclick={handleLayerEvent}
  on:mousedown={handleLayerEvent}
  on:mouseenter={handleLayerEvent}
  on:mouseleave={handleLayerEvent}
  on:mousemove={handleLayerEvent}
  on:mouseup={handleLayerEvent}
  on:mouseover
  on:mouseout
  on:select
  on:wheel={handleLayerEvent}
  on:drag
  on:dragend
  on:dragenter
  on:dragstart
  on:dragleave
  on:dragover
  on:drop
  on:touchcancel={handleLayerEvent}
  on:touchend={handleLayerEvent}
  on:touchmove={handleLayerEvent}
  on:touchstart={handleLayerEvent}
  on:pointerenter={handleLayerEvent}
  on:pointerleave={handleLayerEvent}
  on:pointerdown={handleLayerEvent}
  on:pointermove={handleLayerEvent}
  on:pointerup={handleLayerEvent}
  on:pointercancel={handleLayerEvent}
  on:pointerover
  on:pointerout
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
