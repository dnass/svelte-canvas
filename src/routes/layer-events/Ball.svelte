<script lang="ts">
  import { Layer, type Render, type LayerEvent } from '$lib';
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

  const onEnter = () => {
    document.body.style.cursor = 'pointer';
    radius.set(90);
  };

  const onLeave = () => {
    document.body.style.cursor = 'default';
    dragging = false;
    radius.set(80);
  };

  const onDown = () => {
    reorder(color);
    dragging = true;
    radius.set(120);
  };

  const onUp = () => {
    dragging = false;
    radius.set(80);
  };

  const onMove = (e: LayerEvent) => {
    if (dragging) {
      _x.set(<number>e.detail.x);
      _y.set(<number>e.detail.y);
    }
  };
</script>

<Layer
  {render}
  on:mouseenter={onEnter}
  on:mouseleave={onLeave}
  on:mousedown={onDown}
  on:mousemove={onMove}
  on:mouseup={onUp}
  on:touchstart={onDown}
  on:touchmove={onMove}
  on:touchend={onUp}
/>
