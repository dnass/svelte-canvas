<script>
  import { Canvas, Layer } from '$lib';
  import { geoOrthographic, geoGraticule10, geoPath } from 'd3-geo';
  import { feature } from 'topojson-client';
  import land from 'world-atlas/land-110m.json';

  let width,
    map = feature(land, 'land');

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
    render={({ context, time }) => {
      path.context(context);
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
