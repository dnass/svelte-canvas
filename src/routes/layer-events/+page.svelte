<script lang="ts">
  import '../../page.css';
  import { Canvas } from '$lib';
  import Ball from './Ball.svelte';

  let balls = [
    { color: '#f00', x: 320, y: 213 },
    { color: '#0f0', x: 213, y: 400 },
    { color: '#00f', x: 427, y: 400 },
  ];

  const reorder = (color: string) => {
    balls = balls
      .filter((c) => c.color !== color)
      .concat(balls.filter((c) => c.color === color));
  };
</script>

<Canvas
  style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 5px solid black; border-radius: 2rem;"
  width={640}
  height={640}
  pixelRatio={2}
  layerEvents={true}
>
  {#each balls as { color, x, y } (color)}
    <Ball {color} {x} {y} {reorder} />
  {/each}
</Canvas>
