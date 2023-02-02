import { rgbToId } from '../util/color';

type ContextKeys = Exclude<keyof CanvasRenderingContext2D, 'canvas'>;

const EXCLUDED_GETTERS = ['drawImage', 'setTransform'];
const EXCLUDED_SETTERS = ['filter', 'shadowBlur', 'globalCompositeOperation'];
const FILL_OVERRIDES = ['drawImage', 'fill', 'fillRect', 'fillText'];
const STROKE_OVERRIDES = ['stroke', 'strokeRect', 'strokeText'];

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj;

class TrackerProxy {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  proxy: CanvasRenderingContext2D;

  constructor(
    context: CanvasRenderingContext2D,
    renderingLayerColor: () => string
  ) {
    this.canvas = document.createElement('canvas');
    const trackerContext = this.canvas.getContext('2d', {
      willReadFrequently: true
    }) as CanvasRenderingContext2D;

    this.context = trackerContext;

    this.proxy = new Proxy(context, {
      get(target, property: keyof CanvasRenderingContext2D) {
        const val = hasKey(target, property) ? target[property] : false;
        if (typeof val !== 'function') return val;

        return function (...args: any[]) {
          if (FILL_OVERRIDES.includes(property as string)) {
            trackerContext.fillStyle = renderingLayerColor();
          }

          if (STROKE_OVERRIDES.includes(property as string)) {
            trackerContext.strokeStyle = renderingLayerColor();
          }

          if (property === 'drawImage') {
            const [x, y, w, h] = args.slice(1, 5);
            trackerContext.fillRect(x, y, w, h);
          }

          if (!EXCLUDED_GETTERS.includes(property as string)) {
            Reflect.apply(val, trackerContext, args);
          }

          return Reflect.apply(val, target, args);
        };
      },
      set(target, property: ContextKeys, newValue) {
        (target[property] as any) = newValue;

        if (!EXCLUDED_SETTERS.includes(property as string)) {
          (trackerContext[property] as ContextKeys) = newValue;
        }

        return true;
      }
    });
  }

  setCanvasSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  getIdAtPixel(x: number, y: number): number {
    const pixel = this.context.getImageData(x, y, 1, 1).data;
    return rgbToId(pixel[0], pixel[1], pixel[2]);
  }
}

export default TrackerProxy;
