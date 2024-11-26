<script lang="ts">
  import type { Snippet } from 'svelte';
  import Code from './Code.svelte';

  let {
    width = '100%',
    aspectRatio = '1',
    files = [],
    children,
  }: {
    width: string;
    aspectRatio: string;
    files: string[][];
    children: Snippet;
  } = $props();
</script>

<div style:max-width={width} style:aspect-ratio={aspectRatio}>
  {@render children()}
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
