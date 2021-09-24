<script>
  import { getContext, onDestroy } from 'svelte';
  import { KEY } from './Canvas.svelte';

  const { register, unregister, redraw } = getContext(KEY);

  export let setup = undefined,
    render = () => {};

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
