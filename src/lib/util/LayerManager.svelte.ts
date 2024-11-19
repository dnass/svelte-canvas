import type { HitCanvasRenderingContext2D as HitContext } from 'hit-canvas';
import { SvelteMap } from 'svelte/reactivity';
import { getEventCoords, SUPPORTED_EVENTS } from './events';
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
  setups: Map<number, Render> = new SvelteMap();
  renderers: Map<number, Render> = new SvelteMap();
  eventHandlers: Map<number, LayerEventHandlers> = new SvelteMap();

  currentLayerId = 1;
  startTime = Date.now();
  frame = $state(0);

  context?: CanvasContext;

  canvasConfig: CanvasConfig;

  renderLoop?: number;

  layerObserver?: MutationObserver;
  layerSequence: number[] = [];

  activeLayerId = 0;
  activeLayerEventHandlers?: LayerEventHandlers;

  constructor(canvasConfig: CanvasConfig) {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);

    this.canvasConfig = canvasConfig;
  }

  async init(context: CanvasContext, layerRef: HTMLElement) {
    this.context = context;
    this.observeLayerSequence(layerRef);

    this.tick();
    $effect(() => this.render());
  }

  redraw() {
    this.frame++;
  }

  register({ setup, render, ...eventHandlers }: LayerProps) {
    if (setup) {
      this.setups.set(this.currentLayerId, setup);
    }

    this.renderers.set(this.currentLayerId, render);

    if (Object.keys(eventHandlers).length) {
      if (this.canvasConfig.layerEvents) {
        this.eventHandlers.set(this.currentLayerId, eventHandlers);
      } else {
        warn(
          'Canvas must have layerEvents={true} in order to use layer-level event handlers',
        );
      }
    }

    this.redraw();

    return {
      redraw: this.redraw,
      unregister: () => this.unregister(this.currentLayerId),
      layerId: this.currentLayerId++,
    };
  }

  unregister(layerId: number) {
    this.renderers.delete(layerId);
    this.eventHandlers.delete(layerId);
    this.redraw();
  }

  observeLayerSequence(layerRef: HTMLElement) {
    const getLayerSequence = () => {
      const layers = <HTMLElement[]>[...layerRef.children];
      this.layerSequence = layers.map((layer) => +layer.dataset.layerId!);
      this.redraw();
    };

    this.layerObserver = new MutationObserver(() => getLayerSequence());
    this.layerObserver.observe(layerRef, { childList: true });
    getLayerSequence();
  }

  tick() {
    if (this.canvasConfig.autoplay) {
      this.redraw();
    }

    this.renderLoop = requestAnimationFrame(() => {
      this.tick();
    });
  }

  render() {
    this.frame;

    const context = <CanvasRenderingContext2D>this.context;
    const { width, height, pixelRatio, autoclear } = this.canvasConfig;

    const time = Date.now() - this.startTime;
    const renderProps = { context, width, height, time };

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    for (const [layerId, setup] of this.setups) {
      setup(renderProps);
      this.setups.delete(layerId);
    }

    if (autoclear) {
      context.clearRect(0, 0, width, height);
    }

    for (const layerId of this.layerSequence) {
      (<HitContext>this.context).setCurrentLayerId?.(layerId);
      this.renderers.get(layerId)?.(renderProps);
    }
  }

  createEventHandlers() {
    const handleEvent = (e: MouseEvent | TouchEvent) => {
      const { handlers, layerEvents, pixelRatio } = this.canvasConfig;

      const canvasHandler = handlers[<CanvasEventHandler>`on${e.type}`];
      canvasHandler?.(e);

      if (!layerEvents) return;

      const { x, y } = getEventCoords(e);

      if (['touchstart', 'pointermove'].includes(e.type)) {
        const id = (<HitContext>this.context).getLayerIdAt(
          x * pixelRatio,
          y * pixelRatio,
        );
        this.setActiveLayer(id, e);
      }

      if (!this.activeLayerEventHandlers) return;

      const layerHandlerType = `on${e.type.replace('layer.', '')}`;
      const layerHandler =
        this.activeLayerEventHandlers[<LayerEventHandler>layerHandlerType];
      layerHandler?.({ x, y, originalEvent: e });
    };

    return SUPPORTED_EVENTS.reduce(
      (acc, type) => ({ ...acc, [type]: handleEvent }),
      {},
    );
  }

  setActiveLayer(layer: number, e: MouseEvent | TouchEvent) {
    if (this.activeLayerId === layer) return;

    if (e instanceof MouseEvent) {
      e.target?.dispatchEvent(new PointerEvent('layer.pointerleave', e));
      e.target?.dispatchEvent(new MouseEvent('layer.mouseleave', e));
    }

    this.activeLayerId = layer;
    this.activeLayerEventHandlers = this.eventHandlers.get(layer);

    if (e instanceof MouseEvent) {
      e.target?.dispatchEvent(new PointerEvent('layer.pointerenter', e));
      e.target?.dispatchEvent(new MouseEvent('layer.mouseenter', e));
    }
  }

  destroy() {
    if (typeof window === 'undefined') return;

    this.layerObserver?.disconnect();
    cancelAnimationFrame(this.renderLoop!);
  }
}

export default LayerManager;
