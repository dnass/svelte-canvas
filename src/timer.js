import { readable } from 'svelte/store';

let frame;

const now = Date.now();

function start(set) {
  set(Date.now() - now);

  frame = window.requestAnimationFrame(() => start(set));
  return () => window.cancelAnimationFrame(frame);
}

function noop() {}

export default readable(
  Date.now() - now,
  typeof window === 'undefined' ? noop : start
);
