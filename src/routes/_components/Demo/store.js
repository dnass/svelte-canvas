import { writable } from 'svelte/store';

export const coords = writable([null, null]);
export const activeLayer = writable(null);
