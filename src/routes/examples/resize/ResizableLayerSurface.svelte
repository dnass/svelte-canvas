<script>
  import { Layer } from '$lib';

  export let bounds,
    show = false;

  $: render = ({ context }) => {
    const { x0, y0, x1, y1 } = bounds;

    if (show) {
      context.strokeStyle = '#444';
      context.lineWidth = 2;
      context.strokeRect(x0, y0, x1 - x0, y1 - y0);
    }

    context.globalAlpha = 0;
    context.fillRect(x0, y0, x1 - x0, y1 - y0);
    context.globalAlpha = 1;
  };
</script>

<Layer
  {render}
  on:mouseenter
  on:mouseleave
  on:mousedown
  on:mouseup
  on:touchstart
  on:touchend
/>
