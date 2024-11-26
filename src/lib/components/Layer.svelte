<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { LayerProps } from '../types';
  import { register } from './Canvas.svelte';

  const layer: LayerProps = $props();
  const { layerId, unregister } = register(layer);

  onDestroy(unregister);
</script>

<div data-layer-id={layerId}></div>
