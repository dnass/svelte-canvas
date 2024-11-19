<script>
  import { Layer } from '$lib';
  import { spring, tweened } from 'svelte/motion';
  import { quadInOut as easing } from 'svelte/easing';
  import { coords, activeLayer } from './store';

  let { name, render } = $props();

  const id = Symbol();

  const styleTween = (initial) => {
    const tween = tweened(initial, { duration: 250, easing });
    return {
      subscribe: tween.subscribe,
      set: (value) => tween.set(value, { delay: Math.random() * 50 + 10 }),
    };
  };

  const blur = styleTween(0);
  const saturation = styleTween(1);
  const opacity = styleTween(1);
  const scale = spring(1, { stiffness: 0.1, damping: 0.2 });

  let active = $derived($activeLayer?.id === id);
  let inactive = $derived($activeLayer?.id && !active);

  $effect(() => {
    blur.set(inactive ? 0.018 : 0);
    saturation.set(inactive ? 0.4 : 1);
    opacity.set(inactive ? 0.5 : 1);
  });

  $effect(() => {
    scale.set(
      !$activeLayer?.id ? 1 : (!active ? 0.95 : 1.1) + Math.random() / 10,
    );
  });

  let styleActive = $derived((context) => () => {
    if (active) {
      context.setLineDash([4, 4]);
      context.strokeStyle = '#dcdcdc';
      context.lineWidth = 2;
    }

    return active;
  });

  const _render = ({ context, width, height, time }) => {
    const [x, y] = $coords;
    context.save();
    context.translate(x, y);
    context.scale($scale, $scale);
    context.translate(-x, -y);
    context.globalAlpha = $opacity;
    context.filter = `blur(${width * $blur}px) saturate(${$saturation * 100}%)`;
    render({ context, width, height, time, active: styleActive(context) });
    context.restore();
  };
</script>

<Layer
  onpointerenter={() => ($activeLayer = { name, id })}
  ontouchstart={() => ($activeLayer = { name, id })}
  onpointerleave={() => ($activeLayer = null)}
  ontouchend={() => ($activeLayer = null)}
  onpointerdown={() => scale.set(0.95)}
  onpointerup={() => scale.set(1.1)}
  render={_render}
/>
