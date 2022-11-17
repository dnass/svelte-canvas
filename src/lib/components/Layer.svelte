<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import { KEY } from './Canvas.svelte';
  import type { Render } from './render';

  const { register, unregister, redraw } = getContext(KEY);

  export let setup: Render | undefined = undefined;
  export let render: Render = () => {};

  if (typeof setup !== 'function' && setup !== undefined) {
    throw new Error('setup must be a function');
  }

  if (typeof render !== 'function') {
    throw new Error('render must be a function');
  }

  const layerId = register({ setup, render });

  onDestroy(() => unregister(layerId));

  $: render, redraw();
</script>

<div data-layer-id={layerId} />
