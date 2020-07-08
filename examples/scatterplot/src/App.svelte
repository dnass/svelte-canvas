<script>
  import { onMount } from "svelte";
  import { Canvas } from "svelte-canvas";
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { Delaunay } from "d3-delaunay";

  import Point from "./Point.svelte";
  import Axis from "./Axis.svelte";

  const margin = { top: 10, right: 10, bottom: 25, left: 25 };

  let points = [];
  let width, height;
  let picked = null,
    click = false;

  onMount(() =>
    fetch(
      "https://raw.githubusercontent.com/vega/vega/master/docs/data/cars.json"
    )
      .then(data => data.json())
      .then(
        data =>
          (points = data.map(d => ({
            mpg: d.Miles_per_Gallon,
            hp: d.Horsepower
          })))
      )
  );

  $: x = scaleLinear()
    .domain(extent(points, d => d.mpg))
    .range([margin.left, width - margin.right])
    .nice();

  $: y = scaleLinear()
    .domain(extent(points, d => d.hp))
    .range([height - margin.bottom, margin.top])
    .nice();

  $: delaunay = Delaunay.from(points, d => x(d.mpg), d => y(d.hp));
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:clientWidth={width} bind:clientHeight={height}>
  <Canvas
    {width}
    {height}
    style="cursor: pointer"
    on:mousemove={({ clientX: x, clientY: y }) => (picked = delaunay.find(x, y))}
    on:mouseout={() => (picked = null)}
    on:mousedown={() => (click = true)}
    on:mouseup={() => (click = false)}>
    <Axis type="x" scale={x} tickNumber={8} {margin} />
    <Axis type="y" scale={y} tickNumber={10} {margin} />
    {#each points as { mpg, hp }, i}
      <Point
        x={x(mpg)}
        y={y(hp)}
        fill="tomato"
        r={i === picked && !click ? 5 : 3}
        stroke={i === picked && '#000'} />
    {/each}
  </Canvas>
</div>
