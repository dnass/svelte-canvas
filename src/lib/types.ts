import type { Snippet } from 'svelte';
import type {
  ClassValue,
  MouseEventHandler,
  PointerEventHandler,
} from 'svelte/elements';
import type { HitCanvasRenderingContext2D } from 'hit-canvas';

export type CanvasContext =
  | CanvasRenderingContext2D
  | HitCanvasRenderingContext2D;

export type LayerEvents =
  | 'click'
  | 'contextmenu'
  | 'dblclick'
  | 'auxclick'
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

export type LayerEventHandler = `on${LayerEvents}`;

type CanvasEvents =
  | LayerEvents
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
  | 'mouseover'
  | 'mouseout'
  | 'select'
  | 'drag'
  | 'dragend'
  | 'dragenter'
  | 'dragstart'
  | 'dragleave'
  | 'dragover'
  | 'drop'
  | 'pointerover'
  | 'pointerout'
  | 'gotpointercapture'
  | 'lostpointercapture';

export type CanvasEventHandler = `on${CanvasEvents}`;

export type CanvasEventHandlers = {
  [key in CanvasEventHandler]?: (event: Event) => void;
};

export type CanvasResizeEvent = {
  width: number;
  height: number;
  pixelRatio: number;
};

export type CanvasProps = {
  width?: number;
  height?: number;
  pixelRatio?: number | 'auto';
  class?: ClassValue | null;
  style?: string;
  autoplay?: boolean;
  autoclear?: boolean;
  layerEvents?: boolean;
  onresize?: (detail: CanvasResizeEvent) => void;
  contextSettings?: CanvasRenderingContext2DSettings;
  children?: Snippet;
} & CanvasEventHandlers;

export type CanvasConfig = {
  width: number;
  height: number;
  pixelRatio: number;
  autoplay: boolean;
  autoclear: boolean;
  layerEvents: boolean;
  contextSettings?: CanvasRenderingContext2DSettings;
  onresize?: (detail: CanvasResizeEvent) => void;
  handlers: CanvasEventHandlers;
};

export type Render = (props: {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
}) => void;

export type LayerEvent = {
  x: number;
  y: number;
  originalEvent: MouseEvent | TouchEvent;
};

export type LayerEventHandlers = {
  [key in LayerEventHandler]?: (detail: LayerEvent) => void;
};

export type LayerProps = {
  setup?: Render;
  render: Render;
} & LayerEventHandlers;

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
