<script>
  import Handle from './ResizableLayerHandle.svelte';
  import Surface from './ResizableLayerSurface.svelte';

  const [N, S, E, W] = [1, 2, 4, 8],
    HANDLES = [N, S, E, W, N | E, N | W, S | E, S | W],
    SURFACE = N | S | E | W;

  export let initialBounds = { x0: 160, y0: 160, x1: 480, y1: 480 };

  let { x0, y0, x1, y1 } = initialBounds;

  let hoveredHandle = null,
    draggedHandle = null,
    previousTouch;

  $: bounds = { x0, y0, x1, y1 };
  $: active = Boolean(hoveredHandle || draggedHandle);
  $: sortedHandles = HANDLES.sort((a, b) =>
    a === hoveredHandle ? 1 : b === hoveredHandle ? -1 : 0,
  );

  const setCursor = ({ style }) => ({
    update: (cursor) => (style.cursor = cursor),
  });
</script>

<svelte:body
  use:setCursor={active ? 'pointer' : 'auto'}
  on:mousemove={({ movementX, movementY }) => {
    x0 += draggedHandle & W && movementX;
    y0 += draggedHandle & N && movementY;
    x1 += draggedHandle & E && movementX;
    y1 += draggedHandle & S && movementY;
  }}
  on:mouseup={() => (draggedHandle = null)}
  on:pointerdown={() => (draggedHandle = null)}
  on:touchstart={(e) => (previousTouch = e.touches[0])}
  on:touchmove={(e) => {
    const { clientX, clientY } = e.touches[0];
    const movementX = clientX - previousTouch.clientX;
    const movementY = clientY - previousTouch.clientY;
    x0 += draggedHandle & W && movementX;
    y0 += draggedHandle & N && movementY;
    x1 += draggedHandle & E && movementX;
    y1 += draggedHandle & S && movementY;
    previousTouch = e.touches[0];
  }}
/>

<slot {bounds} />

<Surface
  {bounds}
  show={active}
  on:mouseenter={() => (hoveredHandle = SURFACE)}
  on:touchstart={() => (draggedHandle = SURFACE)}
  on:mouseleave={() => (hoveredHandle = null)}
  on:mousedown={() => (draggedHandle = SURFACE)}
  on:mousedown
  on:touchstart
/>

{#if active}
  {#each sortedHandles as handle (handle)}
    <Handle
      active={handle === hoveredHandle || handle === draggedHandle}
      x={handle & W ? x0 : handle & E ? x1 : (x0 + x1) / 2}
      y={handle & N ? y0 : handle & S ? y1 : (y0 + y1) / 2}
      on:mouseenter={() => (hoveredHandle = handle)}
      on:touchstart={() => (draggedHandle = handle)}
      on:mouseleave={() => (hoveredHandle = null)}
      on:mousedown={() => (draggedHandle = handle)}
      on:mousedown
      on:touchstart
    />
  {/each}
{/if}
