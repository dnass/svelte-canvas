<script lang="ts">
  import { page } from '$app/stores';

  export let items;
</script>

{#each Object.entries(items) as [title, value]}
  {#if typeof value === 'string'}
    {@const href = `/svelte-canvas${value}`}
    <div class="menu-item">
      <a class:active={$page.url.pathname === href} {href}>{title}</a>
    </div>
  {:else if typeof value === 'object'}
    <p>{title}</p>
    <svelte:self items={value} />
  {/if}
{/each}

<style>
  a {
    color: var(--secondary);
    text-decoration: none;
  }

  a.active {
    font-weight: 700;
    color: var(--primary);
  }

  a:hover {
    text-decoration: underline;
  }

  p {
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 700;
    margin: 1rem 0 0.25rem;
  }
</style>
