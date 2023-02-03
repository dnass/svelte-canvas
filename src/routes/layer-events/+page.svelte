<script lang="ts">
  import '../../page.css';
  import { Canvas } from '$lib';
  import Ball from './Ball.svelte';

  let balls = [
    ['#f00', 320, 213],
    ['#0f0', 213, 400],
    ['#00f', 427, 400]
  ];

  const reorder = (color) => {
    balls = balls
      .filter(([c]) => c !== color)
      .concat([[color, ...balls.find(([c]) => c === color).slice(1)]]);
  };
</script>

<!-- Center canvas horiz and vertically -->
<Canvas
  style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 2rem;"
  width={640}
  height={640}
  pixelRatio={2}
>
  {#each balls as [color, x, y] (color)}
    <Ball {color} {x} {y} {reorder} />
  {/each}
</Canvas>
