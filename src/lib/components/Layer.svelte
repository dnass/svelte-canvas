<script lang="ts">
  import { onDestroy } from 'svelte';
  import { getTypedContext } from './Canvas.svelte';
  import type { Render } from './render';
  import type { EventHandler, EventHandlers } from './layerEvents';

  const { register, unregister, redraw } = getTypedContext();

  export let setup: Render | undefined = undefined;
  export let render: Render = () => undefined;

  export let pointerenter: EventHandler | undefined = undefined;
  export let pointerleave: EventHandler | undefined = undefined;
  export let pointerdown: EventHandler | undefined = undefined;
  export let pointerup: EventHandler | undefined = undefined;
  export let pointermove: EventHandler | undefined = undefined;
  export let click: EventHandler | undefined = undefined;

  const handlers: EventHandlers = {
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
