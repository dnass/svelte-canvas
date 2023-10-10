<script>
  import { Canvas, Layer } from '$lib';
  import { onMount } from 'svelte';
  import { geoOrthographic, geoGraticule10, geoPath } from 'd3-geo';
  import { feature } from 'topojson-client';

  let width, map;

  onMount(() =>
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then((data) => data.json())
      .then((data) => (map = feature(data, 'land'))),
  );

  $: pad = width * 0.02;

  $: projection = geoOrthographic().fitExtent(
    [
      [pad, pad],
      [width - pad, width - pad],
    ],
    { type: 'Sphere' },
  );

  $: path = geoPath(projection);
</script>

<Canvas autoplay on:resize={({ detail }) => (width = detail.width)}>
  <!-- Graticule -->
  <Layer
    setup={({ context }) => path.context(context)}
    render={({ context, time }) => {
      projection.rotate([time / 50, -10]);

      context.strokeStyle = '#ccc';
      context.beginPath();
      path(geoGraticule10());
      context.stroke();
    }}
  />

  <!-- Map -->
  <Layer
    render={({ context }) => {
      context.fillStyle = 'tomato';
      context.beginPath();
      path(map);
      context.fill();
    }}
  />
</Canvas>
