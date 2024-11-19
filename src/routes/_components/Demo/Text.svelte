<script>
  import DemoLayer from './DemoLayer.svelte';

  let { text, scale, opacity = 1, yOffset = 0 } = $props();
</script>

<DemoLayer
  name="Text"
  render={({ context, width, height, active }) => {
    const size = width * scale;
    const offset = height * yOffset;
    context.font = `${size}px 'Fira Mono', monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#dcdcdc';
    context.globalAlpha = opacity;
    context.fillText(text, width / 2, height / 2 + offset);

    const { width: w } = context.measureText(text);
    const rect = [width / 2 - w / 2, height / 2 - size / 2 + offset, w, size];
    context.globalAlpha = 0;
    context.fillRect(...rect);
    context.globalAlpha = 1;

    if (active()) {
      context.strokeRect(...rect);
    }
  }}
/>
