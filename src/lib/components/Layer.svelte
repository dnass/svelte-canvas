<script lang="ts">
  import { afterUpdate, onDestroy, createEventDispatcher } from 'svelte';
  import { getRegisterLayer } from './Canvas.svelte';
  import type { Render } from './render';
  import type { LayerEvents } from './layerEvent';

  export let setup: Render | undefined = undefined;
  export let render: Render = () => undefined;

  const dispatcher = createEventDispatcher<LayerEvents>();
  const register = getRegisterLayer();
  const layer = { setup, render, dispatcher };

  const { layerId, unregister, redraw } = register(layer);

  afterUpdate(redraw);
  onDestroy(unregister);
</script>

<div data-layer-id={layerId} />
