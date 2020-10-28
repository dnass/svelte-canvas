<script>
  import { getContext } from 'svelte';
  import { KEY } from './Canvas.svelte';

  const { register, redraw, priorityChange } = getContext(KEY);

  export let setup = undefined,
    render = () => {},
    priority = undefined;

  if (typeof setup !== 'function' && setup !== undefined) {
    throw new Error('setup must be a function');
  }

  if (typeof render !== 'function') {
    throw new Error('render must be a function');
  }

  if (priority && (!Number.isInteger(priority) || priority <= 0)) {
    throw new Error('priority must be a positive integer');
  }

  register({ setup, renderer: { render, priority: () => priority } });

  $: priority, priorityChange();
  $: priority, render, redraw();
</script>
