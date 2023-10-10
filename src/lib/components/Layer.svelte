<script lang="ts">
  import type { Render, LayerEvents } from '../types';
  import { afterUpdate, onDestroy, createEventDispatcher } from 'svelte';
  import { getRegisterLayer } from './Canvas.svelte';

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
