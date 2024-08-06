<script>
  import { Canvas, Layer } from '$lib';
  import { geoOrthographic, geoGraticule10, geoPath } from 'd3-geo';
  import { feature } from 'topojson-client';
  import land from 'world-atlas/land-110m.json';

  const map = feature(land, 'land');

  let width = $state();
  const pad = $derived(width * 0.02);

  const projection = $derived(
    geoOrthographic().fitExtent(
      [
        [pad, pad],
        [width - pad, width - pad],
      ],
      { type: 'Sphere' },
    ),
  );

  const path = $derived(geoPath(projection));
</script>

<Canvas autoplay onresize={(e) => (width = e.width)}>
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
