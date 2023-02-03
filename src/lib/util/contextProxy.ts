import { idToRgb, rgbToId } from '$lib/util/color';

export interface ContextProxy extends Omit<CanvasRenderingContext2D, 'canvas'> {
  _setCanvasSize(width: number, height: number): void;
  _getLayerIdAtPixel(x: number, y: number): number;
  _renderingLayerId: (() => number) | undefined;
}

const EXCLUDED_GETTERS = ['drawImage', 'setTransform'];
const EXCLUDED_SETTERS = ['filter', 'shadowBlur', 'globalCompositeOperation'];
const COLOR_OVERRIDES = [
  'drawImage',
  'fill',
  'fillRect',
  'fillText',
  'stroke',
  'strokeRect',
  'strokeText'
];

const createContextProxy = (context: CanvasRenderingContext2D) => {
  let renderingLayerId: () => number;
  const canvas = document.createElement('canvas');
  const proxyContext = <ContextProxy>(canvas.getContext('2d', {
    willReadFrequently: true
  }) as unknown);

  return new Proxy(<ContextProxy>(context as unknown), {
    get(target, property: keyof ContextProxy) {
      if (property === '_setCanvasSize') {
        return (width: number, height: number) => {
          canvas.width = width;
          canvas.height = height;
        };
      }

      if (property === '_getLayerIdAtPixel') {
        return (x: number, y: number) => {
          const pixel = proxyContext.getImageData(x, y, 1, 1).data;
          return rgbToId(pixel[0], pixel[1], pixel[2]);
        };
      }

      const val = target[property];
      if (typeof val !== 'function') return val;

      return function (...args: any[]) {
        if (COLOR_OVERRIDES.includes(property)) {
          const layerColor = idToRgb(renderingLayerId());
          proxyContext.fillStyle = layerColor;
          proxyContext.strokeStyle = layerColor;
        }

        if (property === 'drawImage') {
          proxyContext.fillRect(...(<Parameters<CanvasRect['fillRect']>>args));
        }

        if (!EXCLUDED_GETTERS.includes(property)) {
          Reflect.apply(val, proxyContext, args);
        }

        return Reflect.apply(val, target, args);
      };
    },
    set(target, property: keyof ContextProxy, newValue) {
      if (property === '_renderingLayerId') {
        renderingLayerId = newValue;
        return true;
      }

      (<ContextProxy>target[property]) = newValue;

      if (!EXCLUDED_SETTERS.includes(property)) {
        (<ContextProxy>proxyContext[property]) = newValue;
      }

      return true;
    }
  });
};

export { createContextProxy };
