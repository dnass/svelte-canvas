export type CanvasProps = {
  width?: number;
  height?: number;
  pixelRatio?: number;
  class?: string;
  style?: string;
  autoplay?: boolean;
  autoclear?: boolean;
  layerEvents?: boolean;
  onresize?: (detail: ResizeDetail) => void;
  children?: any;
};

export type Render = (props: {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
}) => void;

export type LayerProps = { 
  setup?: Render;
  render: Render;
} & {
  [key in Events]?: (detail: LayerEventDetail) => void;
};

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

export type LayerEvents = {
  [E in Events]: LayerEventDetail;
};

export type CanvasLayerEvent = CustomEvent<LayerEventDetail>;

export type LayerEventDispatcher = (event: Events, detail: LayerEventDetail) => void;

export type ResizeDetail = { width: number; height: number };
