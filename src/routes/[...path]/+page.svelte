<script lang="ts">
  export let data;

  $: title = [data.title, data.category, 'svelte-canvas']
    .filter(Boolean)
    .join(' • ');
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<svelte:component this={data.page} />
