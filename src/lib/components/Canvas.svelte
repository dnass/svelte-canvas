<script context="module" lang="ts">
  import { getContext } from 'svelte';
  import LayerManager from '../util/LayerManager';
  import type { RegisterLayer } from '../types';

  const KEY = Symbol();
  export const register = (layer: RegisterLayer) =>
    (<LayerManager['register']>getContext(KEY))(layer);
</script>

<script lang="ts">
  import type { CanvasProps, LayerEventHandler } from '../types';
  import {
    createHitCanvas,
    type HitCanvasRenderingContext2D,
  } from 'hit-canvas';
  import { onDestroy, setContext } from 'svelte';
  import { getMaxPixelRatio } from '../util/getMaxPixelRatio';

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
    ...props
  }: CanvasProps = $props();

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D | HitCanvasRenderingContext2D;
  let layerRef: HTMLDivElement;

  let devicePixelRatio: number = $state(2);
  let maxPixelRatio: number | null = $state(null);
  let canvasWidth: number = $state(0);
  let canvasHeight: number = $state(0);

  const _width = $derived(width ?? canvasWidth);
  const _height = $derived(height ?? canvasHeight);
  const _pixelRatio = $derived.by(() => {
    if (maxPixelRatio) return maxPixelRatio;
    if (pixelRatio && pixelRatio !== 'auto') return pixelRatio;
    return devicePixelRatio;
  });

  $effect(() => {
    if (devicePixelRatio && pixelRatio === 'auto') {
      maxPixelRatio = getMaxPixelRatio(_width, _height, devicePixelRatio);
    } else {
      maxPixelRatio = null;
    }
  });

  $effect(() => {
    onresize?.({ width: _width, height: _height, pixelRatio: _pixelRatio });
  });

  const manager = new LayerManager();
  setContext(KEY, manager.register);

  const redraw = () => manager.redraw();

  export { redraw, canvas, context };

  $effect(() => manager.setProp('width', _width));
  $effect(() => manager.setProp('height', _height));
  $effect(() => manager.setProp('pixelRatio', _pixelRatio));
  $effect(() => manager.setProp('autoplay', autoplay));
  $effect(() => manager.setProp('autoclear', autoclear));

  $effect(() => {
    if (layerEvents) {
      context = createHitCanvas(canvas);
    } else {
      context = canvas.getContext('2d')!;
    }

    manager.init(context, layerRef);
  });

  onDestroy(() => manager.destroy());

  const handleEvent = (e: MouseEvent | TouchEvent) => {
    props[`on${e.type}` as LayerEventHandler]?.(e);

    if (!layerEvents) return;

    switch (e.type) {
      case 'touchstart': {
        const { clientX, clientY } = (e as TouchEvent).changedTouches[0];
        const { left, top } = canvas.getBoundingClientRect();
        const x = (clientX - left) * _pixelRatio;
        const y = (clientY - top) * _pixelRatio;
        const id = (<HitCanvasRenderingContext2D>context).getLayerIdAt(x, y);
        manager.setActiveLayer(id, e);
        manager.dispatchLayerEvent(e);
        break;
      }
      case 'mousemove':
      case 'pointermove': {
        const x = (e as MouseEvent).offsetX * _pixelRatio;
        const y = (e as MouseEvent).offsetY * _pixelRatio;
        const id = (<HitCanvasRenderingContext2D>context).getLayerIdAt(x, y);
        manager.setActiveLayer(id, e);
        manager.dispatchLayerEvent(e);
        break;
      }
      default:
        manager.dispatchLayerEvent(e);
    }
  };

  const layerEventHandlers = [
    'onclick',
    'oncontextmenu',
    'ondblclick',
    'onmousedown',
    'onmouseenter',
    'onmouseleave',
    'onmouseup',
    'onmousemove',
    'onwheel',
    'ontouchstart',
    'ontouchcancel',
    'ontouchend',
    'ontouchmove',
    'onpointerenter',
    'onpointerleave',
    'onpointerdown',
    'onpointerup',
    'onpointermove',
    'onpointercancel',
    'onlayer.mouseenter',
    'onlayer.mouseleave',
    'onlayer.pointerenter',
    'onlayer.pointerleave',
  ].reduce((acc, type) => ({ ...acc, [type]: handleEvent }), {});
</script>

<svelte:window bind:devicePixelRatio />

<canvas
  bind:this={canvas}
  bind:clientWidth={canvasWidth}
  bind:clientHeight={canvasHeight}
  class={className}
  width={_width * _pixelRatio}
  height={_height * _pixelRatio}
  {style}
  style:width={width ? `${width}px` : '100%'}
  style:height={height ? `${height}px` : '100%'}
  {...layerEventHandlers}
></canvas>

<div style:display="none" bind:this={layerRef}>
  {@render children?.()}
</div>
