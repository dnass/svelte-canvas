import type { Render } from '$lib/components/render';
import type {
  Events,
  LayerEventDetail,
  LayerEventDispatcher
} from '$lib/components/layerEvent';

class LayerManager {
  currentLayerId: number;
  setups: Map<number, Render>;
  renderers: Map<number, Render>;
  dispatchers: Map<number, LayerEventDispatcher>;
  needsSetup: boolean;
  needsResize: boolean;
  needsRedraw: boolean;
  renderingLayerId: number;
  activeLayerId: number;
  activeLayerDispatcher: LayerEventDispatcher | undefined;
  layerSequence: number[];

  constructor() {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);
    this.resize = this.resize.bind(this);
    this.getRenderingLayerId = this.getRenderingLayerId.bind(this);

    this.currentLayerId = 1;
    this.setups = new Map();
    this.renderers = new Map();
    this.dispatchers = new Map();

    this.needsSetup = false;
    this.needsResize = true;
    this.needsRedraw = true;

    this.renderingLayerId = 0;
    this.activeLayerId = 0;

    this.layerSequence = [];
  }

  redraw() {
    this.needsRedraw = true;
  }

  resize() {
    this.needsResize = true;
    this.needsRedraw = true;
  }

  register({
    setup,
    render,
    dispatcher
  }: {
    setup: Render | undefined;
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

  render({
    autoclear,
    pixelRatio,
    context,
    width,
    height
  }: {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    pixelRatio: number;
    autoclear: boolean;
  }) {
    const renderProps = { context, width, height };

    if (this.needsResize) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      this.needsResize = false;
    }

    if (this.needsSetup) {
      for (const [layerId, setup] of this.setups) {
        setup(renderProps);
        this.setups.delete(layerId);
      }

      this.needsSetup = false;
    }

    if (this.needsRedraw) {
      if (autoclear) {
        context.clearRect(0, 0, width, height);
      }

      for (const layerId of this.layerSequence) {
        this.renderingLayerId = layerId;
        this.renderers.get(layerId)?.(renderProps);
      }

      this.needsRedraw = false;
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
      this.dispatchLayerEvent(e);
    }
  }

  dispatchLayerEvent(e: MouseEvent | TouchEvent) {
    if (!this.activeLayerDispatcher) return;
    console.log(e.type);

    let detail: LayerEventDetail = {};

    if (e instanceof TouchEvent && e.touches.length) {
      const rect = (<HTMLCanvasElement>e.target).getBoundingClientRect();
      detail.x = e.touches[0].clientX - rect.left;
      detail.y = e.touches[0].clientY - rect.top;
    } else if (e instanceof MouseEvent) {
      detail.x = e.offsetX;
      detail.y = e.offsetY;
    }

    this.activeLayerDispatcher(<Events>e.type, detail);
  }

  getRenderingLayerId() {
    return this.renderingLayerId;
  }
}

export default LayerManager;
