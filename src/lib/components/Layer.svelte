<script lang="ts">
  import { onDestroy, createEventDispatcher } from 'svelte';
  import { getTypedContext } from './Canvas.svelte';
  import type { Render } from './render';
  import type { LayerEvents } from './layerEvent';

  const { register, unregister, redraw } = getTypedContext();

  const dispatcher = createEventDispatcher<LayerEvents>();

  export let setup: Render | undefined = undefined;
  export let render: Render = () => undefined;

  const layerId = register({ setup, render, dispatcher });

  onDestroy(() => unregister(layerId));

  $: render, redraw();
</script>

<div data-layer-id={layerId} />
