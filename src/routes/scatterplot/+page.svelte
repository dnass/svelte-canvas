<script lang="ts">
  import '../../page.css';
  import type { Margin } from './margin';
  import { onMount } from 'svelte';
  import { Canvas } from '$lib';
  import { extent } from 'd3-array';
  import { scaleLinear } from 'd3-scale';
  import { Delaunay } from 'd3-delaunay';

  import Point from './Point.svelte';
  import Axis from './Axis.svelte';

  const margin: Margin = { top: 10, right: 10, bottom: 25, left: 25 };

  interface CarData {
    Name: string;
    Miles_per_Gallon: number;
    Cylinders: number;
    Displacement: number;
    Horsepower: number;
    Weight_in_lbs: number;
    Acceleration: number;
    Year: string;
    Origin: string;
  }

  interface ProcessedCarData {
    mpg: number;
    hp: number;
    id: number;
  }

  let points: ProcessedCarData[] = [];
  let width: number, height: number;
  let picked: number | null = null,
    click = false;

  onMount(() =>
    fetch(
      'https://raw.githubusercontent.com/vega/vega/master/docs/data/cars.json'
    )
      .then((data) => data.json())
      .then((data: CarData[]) => {
        points = data
          .map((d, id) => ({ mpg: d.Miles_per_Gallon, hp: d.Horsepower, id }))
          .filter((d) => d.mpg && d.hp);
      })
  );

  function assertValidDomain<T>(domain: [T, T] | [undefined, undefined]): [T, T] {
    if (domain[0] === undefined && domain[1] === undefined) {
      throw Error("Not a valid domain")
    }
    return domain as [T, T]
  }

  $: x = scaleLinear()
    .domain(assertValidDomain(extent(points, (d) => d.mpg)))
    .range([margin.left, width - margin.right])
    .nice();

  $: y = scaleLinear()
    .domain(assertValidDomain(extent(points, (d) => d.hp)))
    .range([height - margin.bottom, margin.top])
    .nice();

  $: delaunay = Delaunay.from(
    points,
    (d) => x(d.mpg),
    (d) => y(d.hp)
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
        stroke={id === picked ? '#000' : null}
      />
    {/each}
  </Canvas>
</div>
