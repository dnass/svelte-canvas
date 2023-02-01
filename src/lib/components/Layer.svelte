<script lang="ts">
  import { onDestroy } from 'svelte';
  import { getTypedContext } from './Canvas.svelte';
  import type { Render } from './render';

  const { register, unregister, redraw } = getTypedContext();

  export let setup: Render | undefined = undefined;
  export let render: Render = () => undefined;
  export let pointerenter;
  export let pointerleave;
  export let pointerdown;
  export let pointerup;
  export let pointermove;
  export let click;

  const handlers = {
    pointerenter,
    pointerleave,
    pointerdown,
    pointerup,
    pointermove,
    click
  };

  const layerId = register({ setup, render, handlers });

  onDestroy(() => unregister(layerId));

  $: render, redraw();
</script>

<div data-layer-id={layerId} />
