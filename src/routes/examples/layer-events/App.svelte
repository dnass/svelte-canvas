<script>
  import { Canvas } from '$lib';
  import Ball from './Ball.svelte';

  let balls = [
    { color: 'tomato', x: 0.5, y: 0.333 },
    { color: 'goldenrod', x: 0.333, y: 0.625 },
    { color: 'mediumturquoise', x: 0.667, y: 0.625 },
  ];

  const reorder = (color) => {
    balls = balls
      .filter((c) => c.color !== color)
      .concat(balls.filter((c) => c.color === color));
  };
</script>

<Canvas layerEvents style="touch-action: none">
  {#each balls as { color, x, y } (color)}
    <Ball {color} {x} {y} onclick={() => reorder(color)} />
  {/each}
</Canvas>
