<script>
  import DemoLayer from './DemoLayer.svelte';
</script>

<DemoLayer
  name="Circle"
  render={({ context, width, height, active }) => {
    context.fillStyle = 'goldenrod';
    context.translate(width * 0.15, height * 0.7);
    context.beginPath();
    context.arc(0, 0, width * 0.1, 0, 2 * Math.PI);
    context.fill();

    if (active()) {
      context.stroke();
    }
  }}
/>
