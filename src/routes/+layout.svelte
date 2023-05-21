<script>
  import NavMenu from '../_components/NavMenu.svelte';

  export let data;
</script>

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@100;200;300;400;500;600&display=swap');
  </style>
</svelte:head>

<div class="page">
  <div class="nav">
    <nav>
      <h1><a href="/svelte-canvas">svelte-canvas</a></h1>
      <NavMenu items={data.menu} />
    </nav>
  </div>

  <main>
    <slot />
  </main>

  <footer>
    <a href="https://github.com/dnass/svelte-canvas">GitHub</a> |
    <a href="https://www.npmjs.com/package/svelte-canvas">NPM</a>
  </footer>
</div>

<style>
  :root {
    --primary: rgb(255, 62, 0);
    --secondary: rgb(103, 103, 120);
    --blue: #40b3ff;
  }

  :global(body) {
    color: #333;
    margin: 0;
    box-sizing: border-box;
    font-family: Overpass, system-ui, sans-serif;
  }

  :global(.border) {
    border-radius: 2rem;
    overflow: hidden;
    border: 5px solid black;
  }

  .page {
    position: relative;
    display: grid;
    grid-template-columns: 240px 1fr;
    padding: 0.5rem 0.5rem 3rem 1rem;
  }

  .nav {
    grid-column: 1;
  }

  nav {
    position: sticky;
    top: 8px;
    display: flex;
    gap: 0.25rem;
    flex-direction: column;
  }

  a {
    color: var(--secondary);
    text-decoration: none;
  }

  main {
    max-width: 1280px;
    margin: 4rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 4rem;
    grid-column: 2;
  }

  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: var(--blue);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }

  footer a {
    color: white;
    font-size: 1rem;
    padding: 0 10px;
    text-decoration: none;
  }
</style>
