<script>
  import { onMount } from 'svelte';
  import { Canvas } from 'svelte-canvas';
  import { extent } from 'd3-array';
  import { scaleLinear } from 'd3-scale';
  import { Delaunay } from 'd3-delaunay';

  import Point from './Point.svelte';
  import Axis from './Axis.svelte';

  const margin = { top: 10, right: 10, bottom: 25, left: 25 };

  let points = [];
  let width, height;
  let picked = null,
    click = false;

  onMount(() =>
    fetch(
      'https://raw.githubusercontent.com/vega/vega/master/docs/data/cars.json'
    )
      .then(data => data.json())
      .then(data => {
        points = data
          .map((d, id) => ({ mpg: d.Miles_per_Gallon, hp: d.Horsepower, id }))
          .filter(d => d.mpg && d.hp);
      })
  );

  $: x = scaleLinear()
    .domain(extent(points, d => d.mpg))
    .range([margin.left, width - margin.right])
    .nice();

  $: y = scaleLinear()
    .domain(extent(points, d => d.hp))
    .range([height - margin.bottom, margin.top])
    .nice();

  $: delaunay = Delaunay.from(
    points,
    d => x(d.mpg),
    d => y(d.hp)
  );
</script>

<div bind:clientWidth={width} bind:clientHeight={height}>
  <Canvas
    {width}
    {height}
    style="cursor: pointer"
    on:mousemove={({ clientX, clientY }) => {
      const i = delaunay.find(clientX, clientY);
      if (i) {
        picked = points[i].id;
        points.push(points.splice(i, 1)[0]);
        points = points;
      }
    }}
    on:mouseout={() => (picked = null)}
    on:mousedown={() => (click = true)}
    on:mouseup={() => (click = false)}
  >
    <Axis type="x" scale={x} tickNumber={8} {margin} />
    <Axis type="y" scale={y} tickNumber={10} {margin} />
    {#each points as { mpg, hp, id } (id)}
      <Point
        x={x(mpg)}
        y={y(hp)}
        fill="tomato"
        r={id === picked && !click ? 5 : 3}
        stroke={id === picked && '#000'}
      />
    {/each}
  </Canvas>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
