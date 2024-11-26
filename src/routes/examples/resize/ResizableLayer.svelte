<script>
  import Handle from './ResizableLayerHandle.svelte';
  import Surface from './ResizableLayerSurface.svelte';

  const [N, S, E, W] = [1, 2, 4, 8],
    HANDLES = [N, S, E, W, N | E, N | W, S | E, S | W],
    SURFACE = N | S | E | W;

  let {
    initialBounds = { x0: 160, y0: 160, x1: 480, y1: 480 },
    onmousedown,
    ontouchstart,
    content,
  } = $props();

  let x0 = $state(initialBounds.x0);
  let y0 = $state(initialBounds.y0);
  let x1 = $state(initialBounds.x1);
  let y1 = $state(initialBounds.y1);
  const bounds = $derived({ x0, y0, x1, y1 });

  let hoveredHandle = $state(null);
  let draggedHandle = $state(null);
  let previousTouch = $state();

  const active = $derived(Boolean(hoveredHandle || draggedHandle));
  const sortedHandles = $derived(
    HANDLES.sort((a, b) =>
      a === hoveredHandle ? 1 : b === hoveredHandle ? -1 : 0,
    ),
  );

  const setCursor = ({ style }) => ({
    update: (cursor) => (style.cursor = cursor),
  });
</script>

<svelte:body
  use:setCursor={active ? 'pointer' : 'auto'}
  onmousemove={({ movementX, movementY }) => {
    x0 += draggedHandle & W && movementX;
    y0 += draggedHandle & N && movementY;
    x1 += draggedHandle & E && movementX;
    y1 += draggedHandle & S && movementY;
  }}
  onmouseup={() => (draggedHandle = null)}
  onpointerdown={() => (draggedHandle = null)}
  ontouchstart={(e) => (previousTouch = e.touches[0])}
  ontouchmove={(e) => {
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

{@render content(bounds)}

<Surface
  {bounds}
  show={active}
  onmouseenter={() => {
    hoveredHandle = SURFACE;
  }}
  ontouchstart={() => {
    draggedHandle = SURFACE;
    ontouchstart?.();
  }}
  onmouseleave={() => {
    hoveredHandle = null;
  }}
  onmousedown={() => {
    draggedHandle = SURFACE;
    onmousedown?.();
  }}
/>

{#if active}
  {#each sortedHandles as handle (handle)}
    <Handle
      active={handle === hoveredHandle || handle === draggedHandle}
      x={handle & W ? x0 : handle & E ? x1 : (x0 + x1) / 2}
      y={handle & N ? y0 : handle & S ? y1 : (y0 + y1) / 2}
      onmouseenter={() => {
        hoveredHandle = handle;
      }}
      ontouchstart={() => {
        draggedHandle = handle;
        ontouchstart?.();
      }}
      onmouseleave={() => (hoveredHandle = null)}
      onmousedown={() => {
        draggedHandle = handle;
        onmousedown?.();
      }}
    />
  {/each}
{/if}
