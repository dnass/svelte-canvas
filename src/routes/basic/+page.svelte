<script lang="ts">
  import '../../page.css';
  import { Canvas, Layer, t, type Render } from '$lib';

  let render: Render;
  $: render = ({ context, width, height }) => {
    context.fillStyle = `hsl(${$t / 40}, 100%, 50%)`;
    context.beginPath();
    context.arc(($t / 4) % width, ($t / 4) % height, 100, 0, Math.PI * 2);
    context.fill();
  };
</script>

<!-- Center canvas horiz and vertically -->
<Canvas style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 5px solid black; border-radius: 2rem;" width={640} height={640}>
  <Layer {render} />
</Canvas>