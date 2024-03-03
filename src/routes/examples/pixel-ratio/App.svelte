<script>
  import { Canvas, Layer } from '$lib';

  const heights = [
    { value: 1000, label: '1000' },
    { value: 10000, label: '10000' },
    { value: 100000, label: '100000' },
  ];

  const pixelRatios = [
    { value: undefined, label: 'unset' },
    { value: 3, label: '3' },
    { value: 0.5, label: '0.5' },
    { value: 'auto', label: "'auto'" },
  ];

  let heightSetting = heights[0];
  let pixelRatioSetting = pixelRatios[0];

  let pixelRatioValue;

  $: render = ({ context, width }) => {
    context.font = `${width / 20}px 'Fira Mono', monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'tomato';
    context.fillText(
      `pixelRatio: ${pixelRatioValue.toFixed(1)}`,
      width / 2,
      width / 4,
    );
  };
</script>

<div class="controls">
  <div>
    canvas height:
    {#each heights as option}
      <button
        on:click={() => (heightSetting = option)}
        disabled={option.label === heightSetting.label}
      >
        {option.label}
      </button>
    {/each}
  </div>

  <div>
    pixel ratio:
    {#each pixelRatios as option}
      <button
        on:click={() => (pixelRatioSetting = option)}
        disabled={option.label === pixelRatioSetting.label}
      >
        {option.label}
      </button>
    {/each}
  </div>
</div>

<Canvas
  height={heightSetting.value}
  pixelRatio={pixelRatioSetting.value}
  on:resize={(e) => (pixelRatioValue = e.detail.pixelRatio)}
>
  <Layer {render} />
</Canvas>

<style>
  .controls {
    position: absolute;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    column-gap: 1em;
    padding: 0.25em;
  }
</style>
