<script>
  import { getContext } from "svelte";
  import { KEY } from "./Canvas.svelte";

  const { register, redraw } = getContext(KEY);

  export let render;

  register(render);

  $: render, redraw();
</script>
