<script lang="ts">
  import { page } from '$app/stores';

  export let items;
</script>

{#each Object.entries(items) as [title, value]}
  {#if typeof value === 'string'}
    {@const href = `/svelte-canvas${value}`}
    <a class:active={$page.url.pathname.replace(/\/$/, '') === href} {href}>
      {title}
    </a>
  {:else if typeof value === 'object'}
    <p>{title}</p>
    <svelte:self items={value} />
  {/if}
{/each}

<style>
  a {
    display: block;
  }

  a.active {
    font-weight: 600;
    color: var(--primary);
  }

  p {
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 1.5rem 0 0.25rem;
  }
</style>
