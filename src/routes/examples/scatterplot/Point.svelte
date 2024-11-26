<script>
  import { Layer } from '$lib';
  import { spring } from 'svelte/motion';

  const {
    x = 0,
    y = 0,
    r = 1,
    fill = 'black',
    stroke = null,
    strokeWidth = 1,
  } = $props();

  const radius = spring(r, { stiffness: 0.15, damping: 0.3 });
  $effect(() => {
    radius.set(r);
  });

  const render = ({ context }) => {
    const r = Math.max($radius, 0);

    context.fillStyle = fill;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fill();

    if (stroke) {
      context.strokeStyle = stroke;
      context.lineWidth = strokeWidth;
      context.beginPath();
      context.arc(x, y, r + strokeWidth / 2, 0, 2 * Math.PI);
      context.stroke();
    }
  };
</script>

<Layer {render} />
