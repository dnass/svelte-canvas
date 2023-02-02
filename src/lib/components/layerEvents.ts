export type EventHandler = (event: PointerEvent | MouseEvent) => void;

export interface EventHandlers {
  pointerenter?: EventHandler;
  pointerleave?: EventHandler;
  pointerdown?: EventHandler;
  pointerup?: EventHandler;
  pointermove?: EventHandler;
  click?: EventHandler;
}
