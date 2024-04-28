import type { createEventDispatcher } from 'svelte';
import type { MouseEventHandler, PointerEventHandler } from 'svelte/elements';

export interface Render {
  (props: {
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    time: number;
  }): void;
}

export type Events =
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

export type LayerEventMap = {
  [E in Events]: LayerEventDetail;
};

export type CanvasLayerEvent = CustomEvent<LayerEventDetail>;

export type LayerEventDispatcher = ReturnType<
  typeof createEventDispatcher<LayerEventMap>
>;

export type ResizeEvent = {
  resize: { width: number; height: number; pixelRatio: number };
};

declare global {
  namespace svelteHTML {
    interface HTMLAttributes<T> {
      'on:layer.mouseenter'?: MouseEventHandler<T> | undefined | null;
      'on:layer.mouseleave'?: MouseEventHandler<T> | undefined | null;
      'on:layer.pointerenter'?: PointerEventHandler<T> | undefined | null;
      'on:layer.pointerleave'?: PointerEventHandler<T> | undefined | null;
    }
  }
}
