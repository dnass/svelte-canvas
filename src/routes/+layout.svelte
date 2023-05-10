<main>
  <slot />
</main>

<footer>
  <a href="https://github.com/dnass/svelte-canvas">GitHub</a> |
  <a href="https://www.npmjs.com/package/svelte-canvas">NPM</a>
</footer>

<style>
  :root {
    --primary: rgb(255, 62, 0);
    --secondary: rgb(103, 103, 120);
    --blue: #40b3ff;
  }

  :global(body) {
    color: #333;
    margin: 0;
    padding: 8px 8px 50px;
    box-sizing: border-box;
  }

  :global(:is(h1, a)) {
    font-family: Overpass, system-ui, sans-serif;
  }

  :global(.border) {
    border-radius: 2rem;
    overflow: hidden;
    border: 5px solid black;
  }

  main {
    max-width: 1280px;
    margin: 4rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 4rem;
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
