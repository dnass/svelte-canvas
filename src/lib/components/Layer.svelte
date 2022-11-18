<script lang="ts">
  import { onDestroy } from 'svelte';
  import { getTypedContext } from './Canvas.svelte';
  import type { Render } from './render';

  const { register, unregister, redraw } = getTypedContext();

  export let setup: Render | undefined = undefined;
  export let render: Render = () => undefined;

  const layerId = register({ setup, render });

  onDestroy(() => unregister(layerId));

  $: render, redraw();
</script>

<div data-layer-id={layerId} />
