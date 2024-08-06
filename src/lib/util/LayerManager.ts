import type {
  Render,
  LayerEventHandler,
  LayerEventHandlers,
  RegisterLayer,
} from '../types';
import type { HitCanvasRenderingContext2D } from 'hit-canvas';

class LayerManager {
  currentLayerId: number;

  setups: Map<number, Render>;
  renderers: Map<number, Render>;
  eventHandlers: Map<number, LayerEventHandlers>;

  startTime: number;

  needsRedraw: boolean;

  context?: CanvasRenderingContext2D | HitCanvasRenderingContext2D;

  width?: number;
  height?: number;
  autoplay?: boolean;
  autoclear?: boolean;
  pixelRatio?: number;

  renderLoop?: number;

  layerObserver?: MutationObserver;
  layerRef?: HTMLElement;
  layerSequence: number[];

  activeLayerId: number;
  activeLayerEventHandlers?: LayerEventHandlers;

  constructor() {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);

    this.currentLayerId = 1;
    this.setups = new Map();
    this.renderers = new Map();
    this.eventHandlers = new Map();

    this.startTime = Date.now();

    this.needsRedraw = true;

    this.activeLayerId = 0;

    this.layerSequence = [];
  }

  redraw() {
    this.needsRedraw = true;
  }

  register({ setup, render, eventHandlers }: RegisterLayer) {
    if (setup) {
      this.setups.set(this.currentLayerId, setup);
    }

    this.renderers.set(this.currentLayerId, render);

    this.eventHandlers.set(this.currentLayerId, eventHandlers);

    this.needsRedraw = true;

    return {
      redraw: this.redraw,
      unregister: () => this.unregister(this.currentLayerId),
      layerId: this.currentLayerId++,
    };
  }

  unregister(layerId: number) {
    this.renderers.delete(layerId);
    this.eventHandlers.delete(layerId);
    this.needsRedraw = true;
  }

  init(context: CanvasRenderingContext2D, layerRef: HTMLElement) {
    this.context = context;
    this.layerRef = layerRef;
    this.observeLayerSequence();
    this.startRenderLoop();
  }

  setProp(prop: keyof this, value: any) {
    this[prop] = value;
    this.redraw();
  }

  observeLayerSequence() {
    this.layerObserver = new MutationObserver(() => this.getLayerSequence());
    this.layerObserver.observe(this.layerRef!, { childList: true });
    this.getLayerSequence();
  }

  getLayerSequence() {
    const layers = <HTMLElement[]>[...this.layerRef!.children];
    this.layerSequence = layers.map((layer) => +layer.dataset.layerId!);
    this.redraw();
  }

  startRenderLoop() {
    this.render();
    this.renderLoop = requestAnimationFrame(() => this.startRenderLoop());
  }

  render() {
    const context = <CanvasRenderingContext2D>this.context;
    const width = this.width!;
    const height = this.height!;
    const pixelRatio = this.pixelRatio!;

    const time = Date.now() - this.startTime;
    const renderProps = { context, width, height, time };

    for (const [layerId, setup] of this.setups) {
      setup(renderProps);
      this.setups.delete(layerId);
    }

    if (this.needsRedraw) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (this.autoclear) {
        context.clearRect(0, 0, width, height);
      }

      for (const layerId of this.layerSequence) {
        (<HitCanvasRenderingContext2D>this.context).setCurrentLayerId?.(layerId);
        this.renderers.get(layerId)?.(renderProps);
      }

      this.needsRedraw = this.autoplay!;
    }
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

  dispatchLayerEvent(e: MouseEvent | TouchEvent) {
    if (!this.activeLayerEventHandlers) return;

    const eventType = <LayerEventHandler>`on${e.type.replace('layer.', '')}`;
    const eventHandler = this.activeLayerEventHandlers[eventType];
    if (!eventHandler) return;

    if (window.TouchEvent && e instanceof TouchEvent) {
      const { left, top } = (<Element>e.target).getBoundingClientRect();
      const { clientX, clientY } = e.changedTouches[0];

      eventHandler({
        x: clientX - left,
        y: clientY - top,
        originalEvent: e,
      });
    } else if (e instanceof MouseEvent) {
      eventHandler({
        x: e.offsetX,
        y: e.offsetY,
        originalEvent: e,
      });
    }
  }

  destroy() {
    if (typeof window === 'undefined') return;

    this.layerObserver?.disconnect();
    cancelAnimationFrame(this.renderLoop!);
  }
}

export default LayerManager;
