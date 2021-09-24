<script>
  import { onMount } from 'svelte';
  import { Canvas } from 'svelte-canvas';
  import { mesh, feature } from 'topojson-client';
  import { geoIdentity, geoPath } from 'd3-geo';
  import Bubble from './Bubble.svelte';

  let width = 1000;
  $: height = width * 0.6256;

  $: projection = geoIdentity().scale(width / 975);
  $: path = geoPath(projection);

  let us;

  onMount(async () => {
    const data = await fetch(
      'https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json'
    );
    us = await data.json();
  });

  $: centroids = us
    ? feature(us, us.objects.states)
        .features.map(path.centroid)
        .sort(([a], [b]) => b - a)
    : [];
</script>

<div bind:clientWidth={width}>
  <svg {width} {height}>
    {#if us}
      <path d={path(mesh(us, us.objects.states))} />
    {/if}
  </svg>
  <Canvas {width} {height} style="position: absolute">
    {#each centroids as [x, y], i}
      <Bubble {x} {y} {i} />
    {/each}
  </Canvas>
</div>

<style>
  svg {
    position: absolute;
  }

  path {
    stroke: #ccc;
    fill: transparent;
  }
</style>
