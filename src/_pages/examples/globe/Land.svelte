<script>
  import { onMount } from 'svelte';
  import { Layer } from '$lib';
  import { feature } from 'topojson-client';

  export let path;

  let map;

  onMount(() =>
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then((data) => data.json())
      .then((data) => (map = feature(data, 'land'))),
  );

  $: render = ({ context }) => {
    context.fillStyle = 'tomato';
    context.beginPath(), path(map), context.fill();
  };
</script>

<Layer {render} />
