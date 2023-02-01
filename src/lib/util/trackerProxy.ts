const EXCLUDED_GETTERS = ['drawImage', 'setTransform'];
const EXCLUDED_SETTERS = ['filter', 'shadowBlur', 'globalCompositeOperation'];
const COLOR_OVERRIDES = ['fillStyle', 'strokeStyle'];

class TrackerProxy {
  construct(context, getLayerColor) {
    const trackerCanvas = document.createElement('canvas');
    const trackerContext = trackerCanvas.getContext('2d', {
      willReadFrequently: true
    })!;

    trackerCanvas.width = 640;
    trackerCanvas.height = 640;
    return new Proxy(context, {
      get(target, property, receiver) {
        const val = target[property];
        if (typeof val !== 'function') return val;

        return function (...args) {
          if (property === 'drawImage') {
            trackerContext.fillStyle = getLayerColor();
            trackerContext.fillRect(...args.slice(1));
          }

          if (!EXCLUDED_GETTERS.includes(property)) {
            Reflect.apply(val, trackerContext, args);
          }

          return Reflect.apply(val, this === receiver ? target : this, args);
        };
      },
      set(target, property, newValue) {
        target[property] = newValue;

        if (COLOR_OVERRIDES.includes(property)) {
          trackerContext[property] = getLayerColor();
        } else if (!EXCLUDED_SETTERS.includes(property)) {
          trackerContext[property] = newValue;
        }

        return target;
      }
    });
  }
}

export default TrackerProxy;
