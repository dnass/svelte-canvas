<script>
  import { Canvas, Layer } from '$lib';
  import { tweened } from 'svelte/motion';
  import { quadOut as easing } from 'svelte/easing';

  const position = tweened([0.5, 0.5], { duration: 400, easing });

  setInterval(() => {
    position.set([Math.random(), Math.random()]);
  }, 500);

  $: render = ({ context, width, height }) => {
    const [x, y] = $position;
    context.fillStyle = 'tomato';
    context.beginPath();
    context.arc(x * width, y * height, 20, 0, 2 * Math.PI);
    context.fill();
  };
</script>

<Canvas>
  <Layer {render} />
</Canvas>
