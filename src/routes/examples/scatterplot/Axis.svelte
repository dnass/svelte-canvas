<script>
  import { Layer } from '$lib';

  export let scale,
    tickSize = 4,
    margin,
    tickNumber = 10,
    type = 'x';

  $: ticks = scale.ticks(tickNumber);

  $: render = ({ context, height }) => {
    context.beginPath();

    ticks.forEach((d) => {
      if (type === 'x') {
        context.moveTo(scale(d), height - margin.bottom);
        context.lineTo(scale(d), height - margin.bottom + tickSize);
      } else if (type === 'y') {
        context.moveTo(margin.left, scale(d));
        context.lineTo(margin.left - tickSize, scale(d));
      }
    });

    context.strokeStyle = '#ccc';
    context.stroke();

    context.textAlign = type === 'x' ? 'center' : 'right';
    context.textBaseline = type === 'x' ? 'top' : 'middle';
    context.fillStyle = '#ccc';

    ticks.forEach((d) => {
      if (type === 'x') {
        context.fillText(d, scale(d), height - margin.bottom + tickSize + 1);
      } else if (type === 'y') {
        context.fillText(d, margin.left - tickSize - 1, scale(d));
      }
    });
  };
</script>

<Layer {render} />
