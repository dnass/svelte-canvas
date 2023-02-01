import type { Render } from '$lib/components/render';

class LayerManager {
  currentLayerId: number;
  setups: Map<number, Render>;
  renderers: Map<number, Render>;
  layerColorHash: Map<string, Object>;
  layerColors: Map<number, string>;
  needsSetup: boolean;
  needsResize: boolean;
  needsRedraw: boolean;
  renderingLayerColor: string;
  activeLayerColor: string;
  activeLayerHandlers: Object;

  layerSequence: number[];

  constructor() {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    this.getRenderingLayerColor = this.getRenderingLayerColor.bind(this);

    this.currentLayerId = 0;
    this.setups = new Map();
    this.renderers = new Map();
    this.layerColorHash = new Map();
    this.layerColors = new Map();

    this.needsSetup = false;
    this.needsResize = true;
    this.needsRedraw = true;

    this.layerSequence = [];
  }

  redraw() {
    this.needsRedraw = true;
  }

  resize() {
    this.needsResize = true;
    this.needsRedraw = true;
  }

  newColor() {
    while (true) {
      const color = [...new Array(3)]
        .map(() => Math.floor(Math.random() * 255))
        .join(',');
      if (!this.layerColorHash.has(color)) {
        return color;
      }
    }
  }

  register({
    setup,
    render,
    handlers
  }: {
    setup: Render | undefined;
    render: Render;
    handlers: Object;
  }) {
    const color = this.newColor();
    const colorString = `rgb(${color})`;
    this.layerColorHash.set(color, handlers);
    this.layerColors.set(this.currentLayerId, colorString);

    if (setup) {
      this.setups.set(this.currentLayerId, setup);
      this.needsSetup = true;
    }

    this.renderers.set(this.currentLayerId, render);

    this.needsRedraw = true;
    return this.currentLayerId++;
  }

  unregister(layerId: number) {
    this.renderers.delete(layerId);
    const color = this.layerColors.get(layerId);
    this.layerColors.delete(layerId);
    this.layerColorHash.delete(color);
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
        this.renderingLayerColor = this.layerColors.get(layerId);
        this.renderers.get(layerId)?.(renderProps);
      }

      this.needsRedraw = false;
    }
  }

  setActiveLayer(color, e) {
    if (this.activeLayerColor !== color) {
      this.callLayerHandler(new PointerEvent('pointerleave', e));
      this.activeLayerColor = color;
      this.activeLayerHandlers = this.layerColorHash.get(color);
      this.callLayerHandler(new PointerEvent('pointerenter', e));
    }

    this.callLayerHandler(e);
  }

  callLayerHandler(e) {
    this.activeLayerHandlers?.[e.type]?.(e);
  }

  getRenderingLayerColor() {
    return this.renderingLayerColor;
  }
}

export default LayerManager;
