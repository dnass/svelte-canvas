import type { Render } from '../components/render';
import type {
  Events,
  LayerEventDetail,
  LayerEventDispatcher,
} from '../components/layerEvent';

class LayerManager {
  currentLayerId: number;

  setups: Map<number, Render>;
  renderers: Map<number, Render>;
  dispatchers: Map<number, LayerEventDispatcher>;

  startTime: number;

  needsSetup: boolean;
  needsRedraw: boolean;

  context?: CanvasRenderingContext2D;

  width?: number;
  height?: number;
  autoplay?: boolean;
  autoclear?: boolean;
  pixelRatio?: number;

  renderLoop?: number;

  layerObserver?: MutationObserver;
  layerRef?: HTMLElement;
  layerSequence: number[];

  renderingLayerId: number;
  activeLayerId: number;
  activeLayerDispatcher?: LayerEventDispatcher;

  constructor() {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);
    this.getRenderingLayerId = this.getRenderingLayerId.bind(this);

    this.currentLayerId = 1;
    this.setups = new Map();
    this.renderers = new Map();
    this.dispatchers = new Map();

    this.startTime = Date.now();

    this.needsSetup = false;
    this.needsRedraw = true;

    this.renderingLayerId = 0;
    this.activeLayerId = 0;

    this.layerSequence = [];
  }

  redraw() {
    this.needsRedraw = true;
  }

  register({
    setup,
    render,
    dispatcher,
  }: {
    setup?: Render;
    render: Render;
    dispatcher: LayerEventDispatcher;
  }) {
    if (setup) {
      this.setups.set(this.currentLayerId, setup);
      this.needsSetup = true;
    }

    this.renderers.set(this.currentLayerId, render);

    this.dispatchers.set(this.currentLayerId, dispatcher);

    this.needsRedraw = true;
    return this.currentLayerId++;
  }

  unregister(layerId: number) {
    this.renderers.delete(layerId);
    this.dispatchers.delete(layerId);
    this.needsRedraw = true;
  }

  init(context: CanvasRenderingContext2D, layerRef: HTMLElement) {
    this.context = context;
    this.layerRef = layerRef;
    this.observeLayerSequence();
    this.startRenderLoop();
  }

  observeLayerSequence() {
    this.layerObserver = new MutationObserver(this.getLayerSequence.bind(this));
    this.layerObserver.observe(<HTMLElement>this.layerRef, { childList: true });
    this.getLayerSequence();
  }

  getLayerSequence() {
    const layers = [...(<HTMLElement>this.layerRef).children] as HTMLElement[];
    this.layerSequence = layers.map((layer) => +(layer.dataset.layerId ?? -1));
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

    if (this.needsSetup) {
      for (const [layerId, setup] of this.setups) {
        setup({ context, width, height, time: 0 });
        this.setups.delete(layerId);
      }

      this.needsSetup = false;
    }

    if (this.needsRedraw) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (this.autoclear) {
        context.clearRect(0, 0, width, height);
      }

      const time = Date.now() - this.startTime;

      for (const layerId of this.layerSequence) {
        this.renderingLayerId = layerId;
        this.renderers.get(layerId)?.({ context, width, height, time });
      }

      this.needsRedraw = this.autoplay!;
    }
  }

  setActiveLayer(layer: number, e: MouseEvent | TouchEvent) {
    if (this.activeLayerId === layer) return;

    if (e instanceof MouseEvent) {
      this.dispatchLayerEvent(new PointerEvent('pointerleave', e));
      this.dispatchLayerEvent(new MouseEvent('mouseleave', e));
    }

    this.activeLayerId = layer;
    this.activeLayerDispatcher = this.dispatchers.get(layer);

    if (e instanceof MouseEvent) {
      this.dispatchLayerEvent(new PointerEvent('pointerenter', e));
      this.dispatchLayerEvent(new MouseEvent('mouseenter', e));
    }
  }

  dispatchLayerEvent(e: MouseEvent | TouchEvent) {
    if (!this.activeLayerDispatcher) return;

    if (window.TouchEvent && e instanceof TouchEvent) {
      const { left, top } = (<Element>e.target).getBoundingClientRect();
      const { clientX, clientY } = e.changedTouches[0];
      const detail: LayerEventDetail = {
        x: clientX - left,
        y: clientY - top,
        originalEvent: e,
      };

      this.activeLayerDispatcher(<Events>e.type, detail);
    } else if (e instanceof MouseEvent) {
      const detail: LayerEventDetail = {
        x: e.offsetX,
        y: e.offsetY,
        originalEvent: e,
      };

      this.activeLayerDispatcher(<Events>e.type, detail);
    }
  }

  getRenderingLayerId() {
    return this.renderingLayerId;
  }

  destroy() {
    if (typeof window === 'undefined') return;

    (<MutationObserver>this.layerObserver).disconnect();
    cancelAnimationFrame(<number>this.renderLoop);
  }
}

export default LayerManager;
