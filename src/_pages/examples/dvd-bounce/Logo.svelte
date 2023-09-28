<script>
  import { Layer } from '$lib';
  import { onMount } from 'svelte';
  import Logo from './DVD_logo.svg?raw';

  let logo;

  onMount(() => {
    logo = new Image();
    logo.src = `data:image/svg+xml,${encodeURIComponent(Logo)}`;
  });

  let x = 0,
    y = 0,
    xflip = 1,
    yflip = 1;

  const colors = ['tomato', 'goldenrod', 'mediumturquoise'];
  let colorIndex = 0;

  $: render = ({ context, width, height }) => {
    const w = Math.min(210, width / 3);
    const h = w / 2;

    if ((x += 5 * xflip) <= 0 || x + w >= width) {
      xflip *= -1;
      colorIndex++;
    }

    if ((y += 5 * yflip) <= 0 || y + h >= height) {
      yflip *= -1;
      colorIndex++;
    }

    context.fillStyle = colors[colorIndex % colors.length];
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(logo, x, y, w, h);
  };
</script>

<Layer {render} />
