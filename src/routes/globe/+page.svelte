<script lang="ts">
  import '$lib/page.css';
  import { onMount } from 'svelte';
  import { Canvas, Layer, t, type Render } from '$lib';
  import { feature } from 'topojson-client';
  import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';

  let map, width: number;

  const projection = geoOrthographic(),
    path = geoPath(projection);

  onMount(() =>
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then((data) => data.json())
      .then((data) => (map = feature(data, 'land')))
  );

  let graticule: Render; 
  $: graticule = ({ context, width, height }) => {
    projection
      .fitSize([width, height], { type: 'Sphere' })
      .rotate([$t / 50, -10]);

    context.strokeStyle = '#ccc';
    context.beginPath(), path(geoGraticule10()), context.stroke();
  };

  let globe: Render; 
  $: globe = ({ context }) => {
    context.fillStyle = 'tomato';
    context.beginPath(), path(map), context.fill();
  };
</script>

<div bind:clientWidth={width}>
  <Canvas {width} height={width}>
    <Layer setup={({ context }) => path.context(context)} render={graticule} />
    <Layer render={globe} />
  </Canvas>
</div>
