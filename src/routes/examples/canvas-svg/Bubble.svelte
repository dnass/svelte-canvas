<script>
  import { Layer } from '$lib';
  import { quadInOut } from 'svelte/easing';
  import { piecewise, interpolateRgbBasis } from 'd3-interpolate';

  let { x, y, i } = $props();

  const pieces = piecewise([
    { r: 0.005, alpha: 0.1 },
    { r: 0.02, alpha: 0.9 },
    { r: 0.005, alpha: 0.1 },
  ]);

  const scale = (t) => pieces(quadInOut(t));
  const interpolate = interpolateRgbBasis([
    'tomato',
    'goldenrod',
    'mediumturquoise',
  ]);

  const render = ({ context, width, time }) => {
    const { r, alpha } = scale(((time / 25 + i * 3) % 100) / 100);

    context.fillStyle = interpolate(1 - i / 50);
    context.globalAlpha = alpha;
    context.beginPath();
    context.arc(x, y, r * width, 0, Math.PI * 2);
    context.fill();
  };
</script>

<Layer {render} />
