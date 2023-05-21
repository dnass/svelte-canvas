<script>
  import { Canvas, Layer, t } from '$lib';

  $: render = ({ context, width, height }) => {
    context.font = '72px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = `hsl(${$t / 25}, 100%, 50%)`;
    context.fillText('hello world', width / 2, height / 2);
  };
</script>

<Canvas>
  <Layer {render} />
</Canvas>
