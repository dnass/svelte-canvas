<script>
  import { Canvas, Layer } from '$lib';
  import ResizableLayer from './ResizableLayer.svelte';

  let colors = $state(['tomato', 'goldenrod', 'mediumturquoise']);

  const sort = (color) =>
    (colors = colors.sort((a, b) => (a === color ? 1 : b === color ? -1 : 0)));
</script>

<Canvas style="touch-action: none" layerEvents>
  {#each colors as color, i (color)}
    {@const c = (i + 1) * 85}
    <ResizableLayer
      initialBounds={{ x0: c, y0: c, x1: c + 338, y1: c + 338 }}
      onmousedown={() => sort(color)}
      ontouchstart={() => sort(color)}
    >
      {#snippet content(bounds)}
        <Layer
          render={({ context }) => {
            const { x0, y0, x1, y1 } = bounds;
            context.globalAlpha = 0.9;
            context.fillStyle = color;
            context.fillRect(x0, y0, x1 - x0, y1 - y0);
            context.globalAlpha = 1;
          }}
        />
      {/snippet}
    </ResizableLayer>
  {/each}
</Canvas>
