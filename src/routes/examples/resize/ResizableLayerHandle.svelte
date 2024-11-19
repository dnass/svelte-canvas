<script>
  import { Layer } from '$lib';

  let { x, y, active = false, ...eventHandlers } = $props();

  const render = ({ context }) => {
    context.fillStyle = active ? '#111' : '#444';
    context.fillRect(x - 6, y - 6, 12, 12);
  };
</script>

<Layer {render} {...eventHandlers} />
