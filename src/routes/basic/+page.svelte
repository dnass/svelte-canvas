<script>
  import { Canvas, Layer, t } from '$lib';

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

<style global>
  html,
  body {
    position: relative;
    width: 100%;
    height: 100%;
  }

  body {
    color: #333;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
  }
</style>
