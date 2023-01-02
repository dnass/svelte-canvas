<script lang="ts">
  import { Layer, t, type Render } from '$lib';
  import { onMount } from 'svelte';
  import Logo from './DVD_logo.svg?raw';

  const random = () => Math.random() * 200 + 55,
    randomColor = () => `rgb(${random()},${random()},${random()})`;

  let logo: HTMLImageElement;

  onMount(() => {
    logo = new Image();
    logo.src = `data:image/svg+xml,${encodeURIComponent(Logo)}`;
  });

  const w = 210,
    h = 107;

  let x = 0,
    y = 0,
    xflip = 1,
    yflip = 1,
    fill = randomColor();

  let render: Render;
  $: render = ({ context, width, height }) => {
    $t;
    x += 5 * xflip;
    y += 5 * yflip;

    if (x <= 0 || x + w >= width) (xflip *= -1), (fill = randomColor());

    if (y <= 0 || y + h >= height) (yflip *= -1), (fill = randomColor());

    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(logo, x, y, w, h);
  };
</script>

<Layer {render} />
