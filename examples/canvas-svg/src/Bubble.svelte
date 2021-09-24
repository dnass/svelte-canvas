<script>
  import { Layer, t } from 'svelte-canvas';
  import { quadInOut } from 'svelte/easing';
  import { piecewise } from 'd3-interpolate';
  import { interpolateWarm } from 'd3-scale-chromatic';

  export let x, y, i;

  const pieces = piecewise([
    { r: 0.005, alpha: 0.1 },
    { r: 0.02, alpha: 0.9 },
    { r: 0.005, alpha: 0.1 }
  ]);

  const scale = t => pieces(quadInOut(t));

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
