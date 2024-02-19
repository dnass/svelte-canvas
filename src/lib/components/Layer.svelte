<script lang="ts">
  import type { LayerEventDispatcher, LayerProps } from '../types';
  import { onDestroy } from 'svelte';
  import { getRegisterLayer } from './Canvas.svelte';

  let { setup, render, ...props } = $props<LayerProps>();

  const dispatcher: LayerEventDispatcher = (type, detail) => {
    props[type]?.(detail);
  };

  const layer = { setup, render, dispatcher };

  const register = getRegisterLayer();
  const { layerId, unregister } = register(layer);

  onDestroy(unregister);
</script>

<div data-layer-id={layerId} />
