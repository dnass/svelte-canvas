<script>
  import { Canvas, Layer } from '$lib';
</script>

<Canvas autoplay>
  <Layer
    render={({ context, width, height, time }) => {
      context.font = `${width / 10}px sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = `oklch(70% 0.4 ${time / 25}deg)`;
      context.fillText('hello world', width / 2, height / 2);
    }}
  />
</Canvas>
