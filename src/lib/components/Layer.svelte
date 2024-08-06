<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { LayerProps } from '../types';
  import { register } from './Canvas.svelte';

  const { setup, render, ...eventHandlers }: LayerProps = $props();

  const layer = { setup, render, eventHandlers: { ...eventHandlers } };

  const { layerId, unregister } = register(layer);

  onDestroy(unregister);
</script>

<div data-layer-id={layerId} />
