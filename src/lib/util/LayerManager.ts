import type { Render } from '$lib/components/render';
import type { EventHandler, EventHandlers } from '$lib/components/layerEvents';
import { idToRgb } from '../util/color';

class LayerManager {
  currentLayerId: number;
  setups: Map<number, Render>;
  renderers: Map<number, Render>;
  handlers: Map<number, Object>;
  needsSetup: boolean;
  needsResize: boolean;
  needsRedraw: boolean;
  renderingLayerId: number;
  activeLayerId: number;
  activeLayerHandlers: EventHandlers | undefined;
  layerSequence: number[];

  constructor() {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);
    this.resize = this.resize.bind(this);
    this.renderingLayerColor = this.renderingLayerColor.bind(this);

    this.currentLayerId = 1;
    this.setups = new Map();
    this.renderers = new Map();
    this.handlers = new Map();

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
    handlers
  }: {
    setup: Render | undefined;
    render: Render;
    handlers: EventHandlers;
  }) {
    if (setup) {
      this.setups.set(this.currentLayerId, setup);
      this.needsSetup = true;
    }

    this.renderers.set(this.currentLayerId, render);

    this.handlers.set(this.currentLayerId, handlers);

    this.needsRedraw = true;
    return this.currentLayerId++;
  }

  unregister(layerId: number) {
    this.renderers.delete(layerId);
    this.handlers.delete(layerId);
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

  setActiveLayer(layer: number, e: PointerEvent | MouseEvent) {
    if (this.activeLayerId !== layer) {
      this.callLayerHandler(new PointerEvent('pointerleave', e));
      this.activeLayerId = layer;
      this.activeLayerHandlers = this.handlers.get(layer);
      this.callLayerHandler(new PointerEvent('pointerenter', e));
    }

    this.callLayerHandler(e);
  }

  callLayerHandler(e: PointerEvent | MouseEvent) {
    const type = e.type as keyof EventHandlers;
    const handler = this.activeLayerHandlers?.[type];
    handler?.(e);
  }

  renderingLayerColor() {
    return idToRgb(this.renderingLayerId);
  }
}

export default LayerManager;
