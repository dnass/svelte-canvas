export const getEventCoords = (e: MouseEvent | TouchEvent) => {
  if (window.TouchEvent && e instanceof TouchEvent) {
    const { left, top } = (<Element>e.target).getBoundingClientRect();
    const { clientX, clientY } = e.changedTouches[0];

    return { x: clientX - left, y: clientY - top };
  }

  const { offsetX: x, offsetY: y } = <MouseEvent>e;
  return { x, y };
};

export const dispatchLayerEvent = (
  e: MouseEvent | TouchEvent,
  type: 'enter' | 'leave',
) => {
  if (!(e instanceof MouseEvent)) return;

  e.target?.dispatchEvent(new PointerEvent(`layer.pointer${type}`, e));
  e.target?.dispatchEvent(new MouseEvent(`layer.mouse${type}`, e));
};

export const SUPPORTED_EVENTS = [
  // Canvas and layer events
  'onclick',
  'oncontextmenu',
  'ondblclick',
  'onauxclick',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmouseup',
  'onmousemove',
  'onwheel',
  'ontouchstart',
  'ontouchcancel',
  'ontouchend',
  'ontouchmove',
  'onpointerenter',
  'onpointerleave',
  'onpointerdown',
  'onpointerup',
  'onpointermove',
  'onpointercancel',

  // Layer custom events
  'onlayer.mouseenter',
  'onlayer.mouseleave',
  'onlayer.pointerenter',
  'onlayer.pointerleave',

  // Canvas events
  'onfocus',
  'onblur',
  'onfullscreenchange',
  'onfullscreenerror',
  'onscroll',
  'oncut',
  'oncopy',
  'onpaste',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onmouseover',
  'onmouseout',
  'onselect',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragstart',
  'ondragleave',
  'ondragover',
  'ondrop',
  'onpointerover',
  'onpointerout',
  'ongotpointercapture',
  'onlostpointercapture',
];
