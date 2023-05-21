<script>
  import { Canvas, t } from '$lib';
  import { geoOrthographic, geoPath } from 'd3-geo';
  import Land from './Land.svelte';
  import Graticule from './Graticule.svelte';

  let width;

  $: pad = width * 0.02;

  $: projection = geoOrthographic()
    .fitExtent(
      [
        [pad, pad],
        [width - pad, width - pad],
      ],
      { type: 'Sphere' },
    )
    .rotate([$t / 50, -10]);

  $: path = geoPath(projection);
</script>

<div bind:clientWidth={width}>
  <Canvas {width} height={width}>
    <Graticule {path} />
    <Land {path} />
  </Canvas>
</div>
