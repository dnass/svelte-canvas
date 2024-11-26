<script>
  import { Canvas } from '$lib';
  import Rect from './Rect.svelte';
  import Circle from './Circle.svelte';
  import Blob from './Blob.svelte';
  import Text from './Text.svelte';
  import Tooltip from './Tooltip.svelte';
  import { coords, activeLayer } from './store';

  const touch = (e) => {
    const { left, top } = e.target.getBoundingClientRect();
    const { clientX, clientY } = e.changedTouches[0];
    $coords = [clientX - left, clientY - top];
  };
</script>

<div>
  <Canvas
    layerEvents
    style="cursor: {$activeLayer ? 'pointer' : 'default'}"
    onpointermove={(e) => ($coords = [e.offsetX, e.offsetY])}
    ontouchstart={touch}
    ontouchmove={touch}
  >
    <Rect />
    <Blob />
    <Circle />
    <Text text="svelte-canvas" yOffset={-0.03} scale={0.06} />
    <Text
      text="Reactive canvas components"
      scale={0.0297}
      yOffset={0.04}
      opacity={0.7}
    />
    {#if $activeLayer?.id}
      <Tooltip />
    {/if}
  </Canvas>
</div>

<style>
  div {
    overflow: hidden;
    position: relative;
    aspect-ratio: 5/3;
    touch-action: none;
  }
</style>
