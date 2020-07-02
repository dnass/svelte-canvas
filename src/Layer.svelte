<script>
  import { getContext } from "svelte";
  import { KEY } from "./Canvas.svelte";

  const { registerSetup, registerRender, redraw } = getContext(KEY);

  export let setup = undefined,
    render = () => {};

  if (typeof setup === "function") {
    registerSetup(setup);
  } else if (typeof setup !== "undefined") {
    throw new Error("setup must be a function");
  }

  if (typeof render === "function") {
    registerRender(render);
  } else {
    throw new Error("render must be a function");
  }

  $: render, redraw();
</script>
