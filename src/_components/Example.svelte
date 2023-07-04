<script lang="ts">
  export let width: string = '640px',
    aspectRatio: string | null = '1';
</script>

<div style:max-width={width} style:aspect-ratio={aspectRatio}>
  <slot />
</div>

<style>
  div {
    width: 100%;
    border-radius: 1rem;
    overflow: hidden;
    border: 4px solid var(--secondary);
  }
</style>
