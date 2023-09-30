<script>
  import DemoLayer from './DemoLayer.svelte';
</script>

<DemoLayer
  name="Rect"
  render={({ context, width, height, active }) => {
    const rect = [width * 0.2, height * 0.1, width * 0.2, width * 0.15];
    context.fillStyle = 'tomato';
    context.fillRect(...rect);

    if (active()) {
      context.strokeRect(...rect);
    }
  }}
/>
