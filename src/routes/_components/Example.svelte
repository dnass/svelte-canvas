<script lang="ts">
  import Code from './Code.svelte';

  export let width: string = '100%',
    aspectRatio: string = '1',
    files: string[] = [];
</script>

<div style:max-width={width} style:aspect-ratio={aspectRatio}>
  <slot />
</div>

<Code copy {files} />

<style>
  div {
    width: 100%;
    justify-self: center;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: var(--bg-light);
  }
</style>
