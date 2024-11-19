<script>
  import { Layer } from '$lib';
  import { onMount, untrack } from 'svelte';
  import Logo from './DVD_logo.svg?raw';

  let logo = $state();

  onMount(() => {
    logo = new Image();
    logo.src = `data:image/svg+xml,${encodeURIComponent(Logo)}`;
  });

  let x = $state(0);
  let y = $state(0);
  let xflip = $state(1);
  let yflip = $state(1);
  let colorIndex = $state(0);

  const colors = ['tomato', 'goldenrod', 'mediumturquoise'];

  const render = ({ context, width, height }) => {
    untrack(() => {
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
    });
  };
</script>

<Layer {render} />
