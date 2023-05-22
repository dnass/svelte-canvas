<script context="module" lang="ts">
  import LayerManager from '../util/LayerManager';
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
  import { createContextProxy, type ContextProxy } from '../util/contextProxy';
  import { onMount, onDestroy, setContext } from 'svelte';

  export let width = 640,
    height = 640,
    pixelRatio: number | null = null,
    style = '',
    autoplay = false,
    autoclear = true,
    layerEvents = false;

  let className = '';

  export { className as class, redraw, getCanvas, getContext };

  let devicePixelRatio: number | undefined;
  $: _pixelRatio = pixelRatio ?? devicePixelRatio ?? 2;

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | ContextProxy | null = null;
  let layerRef: HTMLDivElement;

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

  setContext(KEY, {
    register: manager.register,
    unregister: manager.unregister,
    redraw: manager.redraw,
  });

  onMount(() => {
    const ctx = canvas.getContext('2d')!;

    if (layerEvents) {
      context = createContextProxy(ctx);
      context._renderingLayerId = manager.getRenderingLayerId;
    } else {
      context = ctx;
    }

    manager.init(<CanvasRenderingContext2D>context, layerRef);
  });

  onDestroy(() => manager.destroy());

  const handleLayerMouseMove = (e: MouseEvent) => {
    const x = e.offsetX * _pixelRatio;
    const y = e.offsetY * _pixelRatio;
    const id = (<ContextProxy>context)._getLayerIdAtPixel(x, y);
    manager.setActiveLayer(id, e);
    manager.dispatchLayerEvent(e);
  };

  const handleLayerTouchStart = (e: TouchEvent) => {
    const { clientX, clientY } = e.changedTouches[0];
    const { left, top } = canvas.getBoundingClientRect();
    const x = (clientX - left) * _pixelRatio;
    const y = (clientY - top) * _pixelRatio;
    const id = (<ContextProxy>context)._getLayerIdAtPixel(x, y);
    manager.setActiveLayer(id, e);
    manager.dispatchLayerEvent(e);
  };

  const handleLayerEvent = (e: MouseEvent | TouchEvent) => {
    if (window.TouchEvent && e instanceof TouchEvent) e.preventDefault();
    manager.dispatchLayerEvent(e);
  };

  $: manager.width = width;
  $: manager.height = height;
  $: manager.pixelRatio = _pixelRatio;
  $: manager.autoplay = autoplay;
  $: manager.autoclear = autoclear;
  $: width, height, _pixelRatio, autoclear, manager.redraw();
</script>

<svelte:window bind:devicePixelRatio />

<canvas
  on:touchstart|preventDefault={layerEvents ? handleLayerTouchStart : null}
  on:mousemove={layerEvents ? handleLayerMouseMove : null}
  on:pointermove={layerEvents ? handleLayerMouseMove : null}
  on:click={layerEvents ? handleLayerEvent : null}
  on:contextmenu={layerEvents ? handleLayerEvent : null}
  on:dblclick={layerEvents ? handleLayerEvent : null}
  on:mousedown={layerEvents ? handleLayerEvent : null}
  on:mouseenter={layerEvents ? handleLayerEvent : null}
  on:mouseleave={layerEvents ? handleLayerEvent : null}
  on:mouseup={layerEvents ? handleLayerEvent : null}
  on:wheel={layerEvents ? handleLayerEvent : null}
  on:touchcancel|preventDefault={layerEvents ? handleLayerEvent : null}
  on:touchend|preventDefault={layerEvents ? handleLayerEvent : null}
  on:touchmove|preventDefault={layerEvents ? handleLayerEvent : null}
  on:pointerenter={layerEvents ? handleLayerEvent : null}
  on:pointerleave={layerEvents ? handleLayerEvent : null}
  on:pointerdown={layerEvents ? handleLayerEvent : null}
  on:pointerup={layerEvents ? handleLayerEvent : null}
  on:pointercancel={layerEvents ? handleLayerEvent : null}
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
  width={width * _pixelRatio}
  height={height * _pixelRatio}
  class={className}
  style:display="block"
  style:width="{width}px"
  style:height="{height}px"
  {style}
  bind:this={canvas}
/>

<div style:display="none" bind:this={layerRef}>
  <slot />
</div>
