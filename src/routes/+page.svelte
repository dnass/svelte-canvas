<script lang="ts">
  interface Example {
    href: string;
    name: string;
    description: string;
    color: string;
  }

  const examples: Example[] = [
    {
      href: '/svelte-canvas/basic',
      name: 'Basics',
      description: "An animated ball!",
      color: "#40B3FF"
    },
    {
      href: '/svelte-canvas/canvas-svg',
      name: 'Canvas SVG',
      description: "Fancy map animation",
      color: "#59CD90"
    },
    {
      href: '/svelte-canvas/dvd-bounce',
      name: 'DVD Bounce',
      description: "An office classic",
      color: "#BF9ACA"
    },
    {
      href: '/svelte-canvas/globe',
      name: 'Globe',
      description: "'Round the world",
      color: "#FFE066"
    },
    {
      href: '/svelte-canvas/scatterplot',
      name: 'Scatterplot',
      description: "Hoverable graph!",
      color: "#F79D84"
    }
  ];
</script>

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Overpass:wght@100;200;300;400;500;600&display=swap');
  </style>
</svelte:head>

<section class="wrapper">
  <h1>Svelte Canvas</h1>
  <code>npm install --save-dev svelte-canvas</code>
  <main class="container">
    {#each examples as { name, href, color, description }}
      <a class="example" style="--hover: {color}" {href}>{name}<br/><span class="description">{description}</span></a>
    {/each}
  </main>
</section>

<footer>
  <a href="https://github.com/dnass/svelte-canvas">GitHub</a> |
  <a href="https://www.npmjs.com/package/svelte-canvas">NPM</a>
</footer>

<style>
  :root {
    --primary: rgb(255, 62, 0);
    --secondary: rgb(103, 103, 120);
    --blue: #40B3FF;
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

  h1,
  a {
    font-family: Overpass, system-ui, sans-serif;
  }

  code {
    display: block;
    padding: 0.5rem;
    background-color: #F6F8FA;
    font-size: 1rem;
    border-bottom: 5px solid var(--primary);
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 4rem;
    color: var(--secondary);
    margin-bottom: 0;
  }

  .wrapper {
    margin: auto;
    padding: 1.5rem;
    max-width: 60ch;
    text-align: center;
  }

  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(24ch, 1fr));
    gap: 1rem;
    padding: 0;
  }
  a.example {
    background-image: linear-gradient(
      90deg,
      var(--hover) 80%,
      var(--secondary) 20%
    );
    background-position: 90%;
    transition: background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    background-size: 800%;
    border-radius: 0.5rem;
    font-weight: bold;
    display: block;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 4px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: white;
    text-align: center;
  }

  a.example span.description {
    font-size: 0.8rem;
    font-weight: 400;
  }

  a.example:is(:hover, :focus-within) {
    box-shadow: 0 10px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
    background-position: 77%;
  }
</style>
