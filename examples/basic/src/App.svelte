<script>
  import { Canvas, Layer, t } from "svelte-canvas";

  $: render = ({ context, width, height }) => {
    context.fillStyle = `hsl(${$t / 40}, 100%, 50%)`;
    context.beginPath();
    context.arc(($t / 4) % width, ($t / 4) % height, 100, 0, Math.PI * 2);
    context.fill();
  };
</script>

<Canvas width={640} height={640}>
  <Layer {render} />
</Canvas>
