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
      context: <CanvasRenderingContext2D>context!,
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

  const handleLayerMouseMove = (e: MouseEvent) => {
    const { offsetX: x, offsetY: y } = e;
    const id = (<ContextProxy>context)._getLayerIdAtPixel(x, y);
    manager.setActiveLayer(id, e);
    manager.dispatchLayerEvent(e);
  };

  const handleLayerTouchStart = (e: TouchEvent) => {
    const { clientX: x, clientY: y } = e.touches[0];
    const { left, top } = canvas.getBoundingClientRect();
    const id = (<ContextProxy>context)._getLayerIdAtPixel(x - left, y - top);
    manager.setActiveLayer(id, e);
    manager.dispatchLayerEvent(e);
  };

  const handleLayerEvent = (e: MouseEvent | TouchEvent) => {
    if (e instanceof TouchEvent) e.preventDefault();
    manager.dispatchLayerEvent(e);
  };

  $: width, height, pixelRatio, autoclear, manager.resize();

  $: (<ContextProxy>context)?._setCanvasSize(width, height);
</script>

<canvas
  on:touchstart|preventDefault={handleLayerTouchStart}
  on:mousemove={handleLayerMouseMove}
  on:pointermove={handleLayerMouseMove}
  on:click={handleLayerEvent}
  on:contextmenu={handleLayerEvent}
  on:dblclick={handleLayerEvent}
  on:mousedown={handleLayerEvent}
  on:mouseenter={handleLayerEvent}
  on:mouseleave={handleLayerEvent}
  on:mouseup={handleLayerEvent}
  on:wheel={handleLayerEvent}
  on:touchcancel|preventDefault={handleLayerEvent}
  on:touchend|preventDefault={handleLayerEvent}
  on:touchmove|preventDefault={handleLayerEvent}
  on:pointerenter={handleLayerEvent}
  on:pointerleave={handleLayerEvent}
  on:pointerdown={handleLayerEvent}
  on:pointerup={handleLayerEvent}
  on:pointercancel={handleLayerEvent}
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
