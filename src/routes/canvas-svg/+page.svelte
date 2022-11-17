<script>
  import { onMount } from 'svelte';
  import { Canvas } from '$lib';
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

<style global>
  svg {
    position: absolute;
  }

  path {
    stroke: #ccc;
    fill: transparent;
  }
  html,
  body {
    position: relative;
    width: 100%;
    height: 100%;
  }

  body {
    color: #333;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  a {
    color: rgb(0, 100, 200);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  a:visited {
    color: rgb(0, 80, 160);
  }

  label {
    display: block;
  }

  input,
  button,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }

  input:disabled {
    color: #ccc;
  }

  button {
    color: #333;
    background-color: #f4f4f4;
    outline: none;
  }

  button:disabled {
    color: #999;
  }

  button:not(:disabled):active {
    background-color: #ddd;
  }

  button:focus {
    border-color: #666;
  }
</style>
