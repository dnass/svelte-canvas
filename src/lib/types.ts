import type { Snippet } from 'svelte';
import type { MouseEventHandler, PointerEventHandler } from 'svelte/elements';

type CanvasEvent =
  | 'focus'
  | 'blur'
  | 'fullscreenchange'
  | 'fullscreenerror'
  | 'scroll'
  | 'cut'
  | 'copy'
  | 'paste'
  | 'keydown'
  | 'keypress'
  | 'keyup'
  | 'auxclick'
  | 'click'
  | 'contextmenu'
  | 'dblclick'
  | 'mousedown'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseover'
  | 'mouseout'
  | 'mouseup'
  | 'select'
  | 'wheel'
  | 'drag'
  | 'dragend'
  | 'dragenter'
  | 'dragstart'
  | 'dragleave'
  | 'dragover'
  | 'drop'
  | 'touchcancel'
  | 'touchend'
  | 'touchmove'
  | 'touchstart'
  | 'pointerover'
  | 'pointerenter'
  | 'pointerdown'
  | 'pointermove'
  | 'pointerup'
  | 'pointercancel'
  | 'pointerout'
  | 'pointerleave'
  | 'gotpointercapture'
  | 'lostpointercapture';

export type CanvasProps = {
  width?: number;
  height?: number;
  pixelRatio?: number | 'auto';
  class?: string;
  style?: string;
  autoplay?: boolean;
  autoclear?: boolean;
  layerEvents?: boolean;
  onresize?: (detail: {
    width: number;
    height: number;
    pixelRatio: number;
  }) => void;
  children?: Snippet;
} & {
  [key in `on${CanvasEvent}`]?: (event: Event) => void;
};

export type Render = (props: {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
}) => void;

export type LayerEvent =
  | 'click'
  | 'contextmenu'
  | 'dblclick'
  | 'mousedown'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseup'
  | 'wheel'
  | 'touchcancel'
  | 'touchend'
  | 'touchmove'
  | 'touchstart'
  | 'pointerenter'
  | 'pointerleave'
  | 'pointerdown'
  | 'pointermove'
  | 'pointerup'
  | 'pointercancel';

export type LayerEventDetail = {
  x: number;
  y: number;
  originalEvent: MouseEvent | TouchEvent;
};

export type LayerEventHandler = `on${LayerEvent}`;

export type LayerEventHandlers = {
  [key in LayerEventHandler]?: (detail: LayerEventDetail) => void;
};

export type LayerProps = {
  setup?: Render;
  render: Render;
} & LayerEventHandlers;

export interface RegisterLayer {
  setup?: Render;
  render: Render;
  eventHandlers: LayerEventHandlers;
}

declare global {
  namespace svelteHTML {
    interface HTMLAttributes<T extends EventTarget> {
      'onlayer.mouseenter'?: MouseEventHandler<T> | undefined | null;
      'onlayer.mouseleave'?: MouseEventHandler<T> | undefined | null;
      'onlayer.pointerenter'?: PointerEventHandler<T> | undefined | null;
      'onlayer.pointerleave'?: PointerEventHandler<T> | undefined | null;
    }
  }
}
