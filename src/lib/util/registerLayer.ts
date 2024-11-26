import { getContext } from 'svelte';
import LayerManager from './LayerManager.svelte';
import type { LayerProps } from '../types';

export const REGISTER_KEY = Symbol('register');

export const register = (layer: LayerProps) => {
  const register = getContext<LayerManager['register']>(REGISTER_KEY);
  return register(layer);
};
