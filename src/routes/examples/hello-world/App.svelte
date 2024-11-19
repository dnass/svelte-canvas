<script>
  import { Canvas, Layer } from '$lib';

  const render = ({ context, width, height }) => {
    context.font = `${width / 10}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'tomato';
    context.fillText('hello world', width / 2, height / 2);
  };
</script>

<Canvas>
  <Layer {render} />
</Canvas>
