<script>
  import { Canvas } from '$lib';
  import Ball from './Ball.svelte';

  let balls = [
    { color: '#f00', x: 320, y: 213 },
    { color: '#0f0', x: 213, y: 400 },
    { color: '#00f', x: 427, y: 400 },
  ];

  const reorder = (color) => {
    balls = balls
      .filter((c) => c.color !== color)
      .concat(balls.filter((c) => c.color === color));
  };
</script>

<Canvas layerEvents={true}>
  {#each balls as { color, x, y } (color)}
    <Ball {color} {x} {y} {reorder} />
  {/each}
</Canvas>
