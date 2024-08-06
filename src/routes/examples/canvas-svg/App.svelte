<script>
  import { Canvas } from '$lib';
  import { mesh, feature } from 'topojson-client';
  import { geoIdentity, geoPath } from 'd3-geo';
  import Bubble from './Bubble.svelte';
  import us from 'us-atlas/states-albers-10m.json';

  let width = $state();

  const projection = $derived(geoIdentity().scale(width / 975));
  const path = $derived(geoPath(projection));

  const centroids = $derived(
    us
      ? feature(us, us.objects.states)
          .features.map(path.centroid)
          .sort(([a], [b]) => b - a)
      : [],
  );
</script>

<div>
  <svg>
    {#if us}
      <path d={path(mesh(us, us.objects.states))} />
    {/if}
  </svg>
  <Canvas
    onresize={(e) => (width = e.width)}
    style="position: absolute"
    autoplay
  >
    {#each centroids as [x, y], i}
      <Bubble {x} {y} {i} />
    {/each}
  </Canvas>
</div>

<style>
  div {
    position: relative;
    height: 100%;
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  path {
    stroke: #ccc;
    fill: transparent;
  }
</style>
