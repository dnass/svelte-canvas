<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import { KEY } from './Canvas.svelte';
  import type { Render } from './render';

  const { register, unregister, redraw } = getContext(KEY);

  export let setup: Render | undefined = undefined;
  export let render: Render = () => undefined;

  const layerId = register({ setup, render });

  onDestroy(() => unregister(layerId));

  $: render, redraw();
</script>

<div data-layer-id={layerId} />
