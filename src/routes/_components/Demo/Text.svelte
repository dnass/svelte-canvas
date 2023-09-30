<script>
  import DemoLayer from './DemoLayer.svelte';

  export let text,
    scale,
    opacity = 1,
    yOffset = 0;
</script>

<DemoLayer
  name="Text"
  render={({ context, width, height, active }) => {
    const size = width * scale;
    const offset = height * yOffset;
    context.font = `${size}px 'Source Code Pro', monospace`;
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
