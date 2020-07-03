<script>
  import { getContext } from "svelte";
  import { writable } from "svelte/store";
  import { KEY } from "./Canvas.svelte";

  const { register, redraw } = getContext(KEY);

  export let setup = undefined,
    render = () => {},
    priority = undefined;

  if (typeof setup !== "function" && setup !== undefined) {
    throw new Error("setup must be a function");
  }

  if (typeof render !== "function") {
    throw new Error("render must be a function");
  }

  if (priority && (!Number.isInteger(priority) || priority <= 0)) {
    throw new Error("priority must be a positive integer");
  }

  const p = writable(priority);

  register({ setup, renderer: { render, priority: p } });

  $: p.set(priority), redraw();
  $: render, redraw();
</script>
