<script>
  import Handle from './ResizableLayerHandle.svelte';
  import Surface from './ResizableLayerSurface.svelte';

  const N = 1,
    S = 2,
    E = 4,
    W = 8;
  const handles = [N, S, E, W, N | E, N | W, S | E, S | W],
    surface = N | S | E | W;

  export let initialBounds = { x0: 160, y0: 160, x1: 480, y1: 480 };

  let { x0, y0, x1, y1 } = initialBounds;

  let hoveredHandle = null,
    draggedHandle = null;

  $: bounds = { x0, y0, x1, y1 };
  $: active = Boolean(hoveredHandle || draggedHandle);
  $: sortedHandles = handles.sort((a, b) =>
    a === hoveredHandle ? 1 : b === hoveredHandle ? -1 : 0,
  );

  const setCursor = ({ style }) => ({
    update: ({ active }) => (style.cursor = active ? 'pointer' : 'default'),
  });
</script>

<svelte:body
  use:setCursor={{ active, bounds }}
  on:mousemove={({ movementX, movementY }) => {
    x0 += draggedHandle & W && movementX;
    y0 += draggedHandle & N && movementY;
    x1 += draggedHandle & E && movementX;
    y1 += draggedHandle & S && movementY;
  }}
  on:mouseup={() => (draggedHandle = null)}
/>

<slot {bounds} />

<Surface
  {bounds}
  show={active}
  on:mouseenter={() => (hoveredHandle = surface)}
  on:mouseleave={() => (hoveredHandle = null)}
  on:mousedown={() => (draggedHandle = surface)}
  on:mousedown
/>

{#if active}
  {#each sortedHandles as handle (handle)}
    <Handle
      active={handle === hoveredHandle || handle === draggedHandle}
      x={handle & W ? x0 : handle & E ? x1 : (x0 + x1) / 2}
      y={handle & N ? y0 : handle & S ? y1 : (y0 + y1) / 2}
      on:mouseenter={() => (hoveredHandle = handle)}
      on:mouseleave={() => (hoveredHandle = null)}
      on:mousedown={() => (draggedHandle = handle)}
      on:mousedown
    />
  {/each}
{/if}
