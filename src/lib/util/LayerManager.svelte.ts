import type { HitCanvasRenderingContext2D as HitContext } from 'hit-canvas';
import { onDestroy, untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import { dispatchLayerEvent, getEventCoords, SUPPORTED_EVENTS } from './events';
import { warn } from './console';
import type {
  CanvasContext,
  CanvasConfig,
  Render,
  LayerEventHandler,
  LayerEventHandlers,
  CanvasEventHandler,
  LayerProps,
} from '../types';

class LayerManager {
  #setups: Map<number, Render> = new SvelteMap();
  #renderers: Map<number, Render> = new SvelteMap();
  #eventHandlers: Map<number, LayerEventHandlers> = new SvelteMap();

  #currentLayerId = 1;
  #startTime = Date.now();
  #frame = $state(0);

  #context?: CanvasContext;

  #config: CanvasConfig;

  #autoplayLoop?: number;

  #layerObserver?: MutationObserver;
  #layerSequence: number[] = [];

  #activeLayerId = 0;
  #activeLayerEventHandlers?: LayerEventHandlers;

  constructor(config: CanvasConfig) {
    this.#config = config;
  }

  init(context: CanvasContext, layerRef: HTMLElement) {
    this.#context = context;
    this.#observeLayerSequence(layerRef);

    $effect(() => this.#autoplay());
    $effect(() => this.#handleResize());
    $effect(() => (this.#frame, this.#render()));

    onDestroy(() => this.#destroy());
  }

  redraw() {
    this.#frame++;
  }

  register({ setup, render, ...eventHandlers }: LayerProps) {
    if (setup) {
      this.#setups.set(this.#currentLayerId, setup);
    }

    this.#renderers.set(this.#currentLayerId, render);

    if (Object.keys(eventHandlers).length) {
      if (this.#config.layerEvents) {
        this.#eventHandlers.set(this.#currentLayerId, eventHandlers);
      } else {
        warn(
          'Canvas must have layerEvents={true} in order to use layer-level event handlers',
        );
      }
    }

    this.redraw();

    return {
      unregister: () => this.#unregister(this.#currentLayerId),
      layerId: this.#currentLayerId++,
    };
  }

  #unregister(layerId: number) {
    this.#renderers.delete(layerId);
    this.#eventHandlers.delete(layerId);
    this.redraw();
  }

  #handleResize() {
    const { onresize, width, height, pixelRatio } = this.#config;
    onresize?.({ width, height, pixelRatio });
  }

  #observeLayerSequence(layerRef: HTMLElement) {
    const getLayerSequence = () => {
      const layers = <HTMLElement[]>[...layerRef.children];
      this.#layerSequence = layers.map((layer) => +layer.dataset.layerId!);
      this.redraw();
    };

    this.#layerObserver = new MutationObserver(() => getLayerSequence());
    this.#layerObserver.observe(layerRef, { childList: true });
    getLayerSequence();
  }

  #autoplay() {
    if (this.#config.autoplay) {
      untrack(() => this.redraw());
      this.#autoplayLoop = requestAnimationFrame(() => this.#autoplay());
    } else {
      cancelAnimationFrame(this.#autoplayLoop!);
    }
  }

  #render() {
    const context = <CanvasRenderingContext2D>this.#context;
    const { width, height, pixelRatio, autoclear } = this.#config;

    const time = Date.now() - this.#startTime;
    const renderProps = { context, width, height, time };

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (autoclear) {
      context.clearRect(0, 0, width, height);
    }

    for (const [layerId, setup] of this.#setups) {
      setup(renderProps);
      this.#setups.delete(layerId);
    }

    for (const layerId of this.#layerSequence) {
      (<HitContext>this.#context).setCurrentLayerId?.(layerId);
      this.#renderers.get(layerId)?.(renderProps);
    }
  }

  createEventHandlers() {
    const handleCanvasEvent = (e: MouseEvent | TouchEvent) => {
      const type = <CanvasEventHandler>`on${e.type}`;
      const handler = this.#config.handlers[type];
      handler?.(e);
    };

    const handleLayerEvent = (e: MouseEvent | TouchEvent) => {
      const { pixelRatio } = this.#config;
      const { x, y } = getEventCoords(e);

      if (['touchstart', 'pointermove'].includes(e.type)) {
        const id = (<HitContext>this.#context).getLayerIdAt(
          x * pixelRatio,
          y * pixelRatio,
        );
        this.#setActiveLayer(id, e);
      }

      if (!this.#activeLayerEventHandlers) return;

      const type = <LayerEventHandler>`on${e.type.replace('layer.', '')}`;
      const handler = this.#activeLayerEventHandlers[type];
      handler?.({ x, y, originalEvent: e });
    };

    const handleEvent = (e: MouseEvent | TouchEvent) => {
      handleCanvasEvent(e);

      if (this.#config.layerEvents) {
        handleLayerEvent(e);
      }
    };

    return SUPPORTED_EVENTS.reduce(
      (acc, type) => ({ ...acc, [type]: handleEvent }),
      {},
    );
  }

  #setActiveLayer(layer: number, e: MouseEvent | TouchEvent) {
    if (this.#activeLayerId === layer) return;

    dispatchLayerEvent(e, 'leave');

    this.#activeLayerId = layer;
    this.#activeLayerEventHandlers = this.#eventHandlers.get(layer);

    dispatchLayerEvent(e, 'enter');
  }

  #destroy() {
    if (typeof window === 'undefined') return;

    this.#layerObserver?.disconnect();
    cancelAnimationFrame(this.#autoplayLoop!);
  }
}

export default LayerManager;
