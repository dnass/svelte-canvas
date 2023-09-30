<script>
  import { Canvas } from '$lib';
  import Rect from './Rect.svelte';
  import Circle from './Circle.svelte';
  import Blob from './Blob.svelte';
  import Text from './Text.svelte';
  import Tooltip from './Tooltip.svelte';
  import { coords, activeLayer } from './store';

  const pointerCoords = (e) => ($coords = [e.offsetX, e.offsetY]);
</script>

<div>
  <Canvas
    layerEvents
    style="cursor: {$activeLayer.id ? 'pointer' : 'default'}"
    on:mousemove={pointerCoords}
    on:pointerdown={pointerCoords}
  >
    <Rect />
    <Blob />
    <Circle />
    <Text text="svelte-canvas" yOffset={-0.03} scale={0.06} />
    <Text
      text="Reactive canvas components"
      scale={0.0295}
      yOffset={0.04}
      opacity={0.7}
    />
    {#if $activeLayer.id}
      <Tooltip />
    {/if}
  </Canvas>
</div>

<style>
  div {
    position: relative;
    aspect-ratio: 5/3;
  }
</style>
