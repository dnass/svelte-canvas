import type { Render } from '$lib/components/render';

class RenderManager {
  currentLayerId: number;
  setups: Map<number, Render>;
  renderers: Map<number, Render>;
  needsSetup: boolean;
  needsResize: boolean;
  needsRedraw: boolean;

  layerSequence: number[];

  constructor() {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);

    this.currentLayerId = 0;
    this.setups = new Map();
    this.renderers = new Map();

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

  register({ setup, render }: { setup: Render | undefined; render: Render }) {
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
        this.renderers.get(layerId)?.(renderProps);
      }

      this.needsRedraw = false;
    }
  }
}

export default RenderManager;
