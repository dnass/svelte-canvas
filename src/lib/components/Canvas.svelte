<script context="module" lang="ts">
  import { getContext as getCtx } from 'svelte';
  import LayerManager from '../util/LayerManager';

  const KEY = Symbol();
  export const getRegisterLayer = (): LayerManager['register'] => getCtx(KEY);
</script>

<script lang="ts">
  import type { CanvasProps } from '../types';
  import {
    createHitCanvas,
    type HitCanvasRenderingContext2D,
  } from 'hit-canvas';
  import { onDestroy, setContext } from 'svelte';

  let {
    width,
    height,
    pixelRatio,
    class: className,
    style = '',
    autoplay = false,
    autoclear = true,
    layerEvents = false,
    onresize,
    children,
  } = $props<CanvasProps>();

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | HitCanvasRenderingContext2D;
  let layerRef: HTMLDivElement;

  let devicePixelRatio: number = $state(2);
  let canvasWidth: number = $state(0);
  let canvasHeight: number = $state(0);

  const _width = $derived(width ?? canvasWidth);
  const _height = $derived(height ?? canvasHeight);
  const _pixelRatio = $derived(pixelRatio ?? devicePixelRatio);

  $effect(() => console.log({ _width, _height }));

  const manager = new LayerManager();
  setContext(KEY, manager.register);

  const redraw = () => manager.redraw();
  const getCanvas = () => canvas;
  const getContext = () => <CanvasRenderingContext2D>context;

  export { redraw, getCanvas, getContext };

  $effect(() => manager.setProp('width', _width));
  $effect(() => manager.setProp('height', _height));
  $effect(() => manager.setProp('pixelRatio', _pixelRatio));
  $effect(() => manager.setProp('autoplay', autoplay));
  $effect(() => manager.setProp('autoclear', autoclear));

  $effect(() => {
    if (layerEvents) {
      context = createHitCanvas(canvas);
      manager.onRenderingLayerIdChange((id) => {
        (<HitCanvasRenderingContext2D>context).setCurrentLayerId(id);
      });
    } else {
      context = canvas.getContext('2d')!;
    }

    manager.init(<CanvasRenderingContext2D>context, layerRef);
  });

  onDestroy(() => manager.destroy());

  const handleLayerMouseMove = (e: MouseEvent) => {
    if (!layerEvents) return;

    const x = e.offsetX * _pixelRatio;
    const y = e.offsetY * _pixelRatio;
    const id = (<HitCanvasRenderingContext2D>context).getLayerIdAt(x, y);
    manager.setActiveLayer(id, e);
    manager.dispatchLayerEvent(e);
  };

  const handleLayerTouchStart = (e: TouchEvent) => {
    if (!layerEvents) return;

    const { clientX, clientY } = e.changedTouches[0];
    const { left, top } = canvas.getBoundingClientRect();
    const x = (clientX - left) * _pixelRatio;
    const y = (clientY - top) * _pixelRatio;
    const id = (<HitCanvasRenderingContext2D>context).getLayerIdAt(x, y);
    manager.setActiveLayer(id, e);
    manager.dispatchLayerEvent(e);
  };

  const handleLayerEvent = (e: MouseEvent | TouchEvent) => {
    if (!layerEvents) return;

    manager.dispatchLayerEvent(e);
  };

  $effect(() => onresize?.({ width: _width, height: _height }));
</script>

<svelte:window bind:devicePixelRatio />

<canvas
  bind:this={canvas}
  bind:clientWidth={canvasWidth}
  bind:clientHeight={canvasHeight}
  class={className}
  width={_width * _pixelRatio}
  height={_height * _pixelRatio}
  style:width={width ? `${width}px` : '100%'}
  style:height={height ? `${height}px` : '100%'}
  {style}
  ontouchstart={handleLayerTouchStart}
  onmousemove={handleLayerMouseMove}
  onpointermove={handleLayerMouseMove}
  onclick={handleLayerEvent}
  oncontextmenu={handleLayerEvent}
  ondblclick={handleLayerEvent}
  onmousedown={handleLayerEvent}
  onmouseenter={handleLayerEvent}
  onmouseleave={handleLayerEvent}
  onmouseup={handleLayerEvent}
  onwheel={handleLayerEvent}
  ontouchcancel={handleLayerEvent}
  ontouchend={handleLayerEvent}
  ontouchmove={handleLayerEvent}
  onpointerenter={handleLayerEvent}
  onpointerleave={handleLayerEvent}
  onpointerdown={handleLayerEvent}
  onpointerup={handleLayerEvent}
  onpointercancel={handleLayerEvent}
/>

<div style:display="none" bind:this={layerRef}>
  {@render children()}
</div>
