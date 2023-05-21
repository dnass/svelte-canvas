<script>
  import { Layer } from '$lib';
  import { geoGraticule10 } from 'd3-geo';

  export let path;

  $: render = ({ context }) => {
    path.context(context);
    context.strokeStyle = '#ccc';
    context.beginPath(), path(geoGraticule10()), context.stroke();
  };
</script>

<Layer {render} />
