<script lang="ts">
  import '../../page.css';
  import { Layer, t, type Render } from '$lib';
  import { quadInOut } from 'svelte/easing';
  import { piecewise } from 'd3-interpolate';
  import { interpolateWarm } from 'd3-scale-chromatic';

  export let x: number, y: number, i: number;

  const pieces = piecewise([
    { r: 0.005, alpha: 0.1 },
    { r: 0.02, alpha: 0.9 },
    { r: 0.005, alpha: 0.1 },
  ]);

  const scale = (t: number) => pieces(quadInOut(t));

  let render: Render;
  $: render = ({ context, width }) => {
    const { r, alpha } = scale((($t / 25 + i * 3) % 100) / 100);

    context.fillStyle = interpolateWarm(1 - i / 50);
    context.globalAlpha = alpha;
    context.beginPath();
    context.arc(x, y, r * width, 0, Math.PI * 2);
    context.fill();
  };
</script>

<Layer {render} />
