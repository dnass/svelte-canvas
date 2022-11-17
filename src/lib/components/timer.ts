import { readable, type StartStopNotifier } from 'svelte/store';

let frame: number;

const now = Date.now();

const start: StartStopNotifier<number> = (set) => {
  set(Date.now() - now);

  frame = window.requestAnimationFrame(() => start(set));
  return () => window.cancelAnimationFrame(frame);
}

function noop() {
  void 0;
}

export default readable<number>(
  Date.now() - now,
  typeof window === 'undefined' ? noop : start
);
