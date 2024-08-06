<script>
  import { Layer } from '$lib';
  import { spring } from 'svelte/motion';

  let { x, y, color, onclick } = $props();

  let dragging = $state(false);

  let _x = $state();
  let _y = $state();

  const radius = spring(80, { stiffness: 0.15, damping: 0.2 });

  const setup = ({ width, height }) => {
    _x = spring(width * x, { stiffness: 0.15, damping: 0.2 });
    _y = spring(height * y, { stiffness: 0.15, damping: 0.2 });
  };

  const render = $derived(({ context }) => {
    context.globalCompositeOperation = 'screen';
    context.fillStyle = color;
    context.lineWidth = 10;
    context.beginPath();
    context.arc($_x, $_y, $radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  });

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
    e.originalEvent.preventDefault();
    dragging = true;
    radius.set(120);
    onclick?.();
  };

  const onUp = () => {
    dragging = false;
    radius.set(80);
  };

  const onMove = ({ x, y }) => {
    if (dragging) {
      _x.set(x);
      _y.set(y);
    }
  };
</script>

<Layer
  {setup}
  {render}
  onmouseenter={onEnter}
  onmouseleave={onLeave}
  onmousedown={onDown}
  onmousemove={onMove}
  onmouseup={onUp}
  ontouchstart={onDown}
  ontouchmove={onMove}
  ontouchend={onUp}
/>
