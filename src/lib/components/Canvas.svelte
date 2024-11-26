<script module lang="ts">
  import { getContext } from 'svelte';
  import LayerManager from '../util/LayerManager.svelte';

  const KEY = Symbol();
  export const register = (layer: LayerProps) => {
    const _register = <LayerManager['register']>getContext(KEY);
    return _register(layer);
  };
</script>

<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import { createHitCanvas } from 'hit-canvas';
  import { getMaxPixelRatio } from '../util/getMaxPixelRatio';
  import type { CanvasContext, CanvasProps, LayerProps } from '../types';

  let {
    width: _width,
    height: _height,
    pixelRatio: _pixelRatio,
    class: className,
    style = '',
    autoplay = false,
    autoclear = true,
    layerEvents = false,
    onresize,
    contextSettings,
    children,
    ...handlers
  }: CanvasProps = $props();

  let canvas: HTMLCanvasElement;
  let context: CanvasContext;
  let layerRef: HTMLDivElement;

  let devicePixelRatio: number = $state(2);
  let canvasWidth: number = $state(0);
  let canvasHeight: number = $state(0);

  const width = $derived(_width ?? canvasWidth);
  const height = $derived(_height ?? canvasHeight);

  const pixelRatio = $derived.by(() => {
    if (devicePixelRatio && _pixelRatio === 'auto')
      return getMaxPixelRatio(width, height, devicePixelRatio);

    if (_pixelRatio && _pixelRatio !== 'auto') return _pixelRatio;

    return devicePixelRatio;
  });

  const manager = new LayerManager({
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    get pixelRatio() {
      return pixelRatio;
    },
    get autoplay() {
      return autoplay;
    },
    get autoclear() {
      return autoclear;
    },
    get layerEvents() {
      return layerEvents;
    },
    get onresize() {
      return onresize;
    },
    handlers,
  });

  onMount(() => {
    if (layerEvents) {
      context = createHitCanvas(canvas, contextSettings);
    } else {
      context = canvas.getContext('2d', contextSettings)!;
    }

    manager.init(context, layerRef);
  });

  setContext(KEY, manager.register.bind(manager));

  const redraw = () => manager.redraw();
  export { redraw, canvas, context };
</script>

<svelte:window bind:devicePixelRatio />

<canvas
  bind:this={canvas}
  bind:clientWidth={canvasWidth}
  bind:clientHeight={canvasHeight}
  class={className}
  width={width * pixelRatio}
  height={height * pixelRatio}
  {style}
  style:width={_width ? `${_width}px` : '100%'}
  style:height={_height ? `${_height}px` : '100%'}
  {...manager.createEventHandlers()}
></canvas>

<div style:display="none" bind:this={layerRef}>
  {@render children?.()}
</div>
