<script lang="ts">
  import type { LayerProps } from '../types';
  import { register } from '../util/registerLayer';

  const layer: LayerProps = $props();
  const layerId = register(layer);
</script>

<div data-layer-id={layerId}></div>
