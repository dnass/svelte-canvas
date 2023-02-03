import type { createEventDispatcher } from 'svelte';

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

export type LayerEventDetail = { x?: number; y?: number };

export type LayerEvents = {
  [E in Events]: LayerEventDetail;
};

export type LayerEvent = CustomEvent<LayerEventDetail>;

export type LayerEventDispatcher = ReturnType<
  typeof createEventDispatcher<LayerEvents>
>;
