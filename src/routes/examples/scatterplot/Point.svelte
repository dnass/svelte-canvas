<script>
  import { Layer } from '$lib';
  import { spring } from 'svelte/motion';

  export let x = 0,
    y = 0,
    r = 1,
    fill = 'black',
    stroke = null,
    strokeWidth = 1;

  const radius = spring(r, { stiffness: 0.15, damping: 0.3 });
  $: radius.set(r);

  $: render = ({ context }) => {
    context.fillStyle = fill;
    context.beginPath();
    context.arc(x, y, $radius, 0, 2 * Math.PI);
    context.fill();

    if (stroke) {
      context.strokeStyle = stroke;
      context.lineWidth = strokeWidth;
      context.beginPath();
      context.arc(x, y, $radius + strokeWidth / 2, 0, 2 * Math.PI);
      context.stroke();
    }
  };
</script>

<Layer {render} />
