<script>
  import { Layer } from '$lib';

  export let x,
    y,
    active = false;

  $: render = ({ context }) => {
    context.fillStyle = active ? '#111' : '#444';
    context.fillRect(x - 6, y - 6, 12, 12);
  };
</script>

<Layer {render} on:mouseenter on:mouseleave on:mousedown on:mouseup />
