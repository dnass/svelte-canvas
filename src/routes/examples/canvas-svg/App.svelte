<script>
  import { onMount } from 'svelte';
  import { Canvas } from '$lib';
  import { mesh, feature } from 'topojson-client';
  import { geoIdentity, geoPath } from 'd3-geo';
  import Bubble from './Bubble.svelte';

  let width;

  $: projection = geoIdentity().scale(width / 975);
  $: path = geoPath(projection);

  let us;

  onMount(async () => {
    const data = await fetch(
      'https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json',
    );
    us = await data.json();
  });

  $: centroids = us
    ? feature(us, us.objects.states)
        .features.map(path.centroid)
        .sort(([a], [b]) => b - a)
    : [];
</script>

<div>
  <svg>
    {#if us}
      <path d={path(mesh(us, us.objects.states))} />
    {/if}
  </svg>
  <Canvas
    on:resize={({ detail }) => (width = detail.width)}
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
