<script>
  import { Layer } from '$lib';
  import { spring } from 'svelte/motion';

  export let x, y, color;

  let dragging = false;

  let _x, _y;

  const radius = spring(80, { stiffness: 0.15, damping: 0.2 });

  $: setup = ({ width, height }) => {
    console.log({ width, height });
    _x = spring(width * x, { stiffness: 0.15, damping: 0.2 });
    _y = spring(height * y, { stiffness: 0.15, damping: 0.2 });
  };

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
    document.body.style.cursor = 'auto';
    dragging = false;
    radius.set(80);
  };

  const onDown = (e) => {
    e.detail.originalEvent.preventDefault();
    dragging = true;
    radius.set(120);
  };

  const onUp = () => {
    dragging = false;
    radius.set(80);
  };

  const onMove = (e) => {
    if (dragging) {
      _x.set(e.detail.x);
      _y.set(e.detail.y);
    }
  };
</script>

<Layer
  {setup}
  {render}
  on:mouseenter={onEnter}
  on:mouseleave={onLeave}
  on:mousedown={onDown}
  on:mousedown
  on:mousemove={onMove}
  on:mouseup={onUp}
  on:touchstart={onDown}
  on:touchstart
  on:touchmove={onMove}
  on:touchend={onUp}
/>
