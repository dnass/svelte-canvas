<script>
  import { Layer } from '$lib';
  import { coords, activeLayer } from './store';

  $: [x, y] = $coords;
  $: text = `<${$activeLayer?.name} />`;
</script>

<Layer
  render={({ context }) => {
    const size = 17;
    const tooltipX = x + size;
    const tooltipY = y + size;

    context.font = `${size}px 'Fira Mono', monospace`;
    context.textAlign = 'left';
    context.textBaseline = 'top';

    const { width: w } = context.measureText(text);
    const rect = [tooltipX - 2, tooltipY - 2, w + 4, size + 4];
    context.fillStyle = '#fff';
    context.globalAlpha = 0.9;
    context.fillRect(...rect);
    context.strokeRect(...rect);

    context.globalAlpha = 1;
    context.fillStyle = '#000';
    context.fillText(text, tooltipX, tooltipY);
  }}
/>
