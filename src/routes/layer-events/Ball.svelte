<script lang="ts">
  import { Layer, type Render } from '$lib';
  import { spring } from 'svelte/motion';

  export let x: number, y: number, color: string, reorder: (id: string) => void;

  let render: Render;
  let dragging = false;

  const _x = spring(x, { stiffness: 0.15, damping: 0.2 });
  const _y = spring(y, { stiffness: 0.15, damping: 0.2 });
  const radius = spring(80, { stiffness: 0.15, damping: 0.2 });

  $: render = ({ context }) => {
    context.globalCompositeOperation = 'screen';
    context.fillStyle = color;
    context.lineWidth = 10;
    context.beginPath();
    context.arc($_x, $_y, $radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  };
</script>

<Layer
  {render}
  on:pointerenter={() => {
    document.body.style.cursor = 'pointer';
    radius.set(90);
  }}
  on:pointerleave={() => {
    document.body.style.cursor = 'default';
    dragging = false;
    radius.set(80);
  }}
  on:pointerdown={() => {
    reorder(color);
    dragging = true;
    radius.set(120);
  }}
  on:pointerup={() => {
    dragging = false;
    radius.set(80);
  }}
  on:pointermove={(e) => {
    if (dragging) {
      _x.set(e.detail.x);
      _y.set(e.detail.y);
    }
  }}
  on:touchmove={(e) => {
    _x.set(e.detail.x);
    _y.set(e.detail.y);
  }}
  on:dblclick={() => {
    radius.set(200);
  }}
/>
