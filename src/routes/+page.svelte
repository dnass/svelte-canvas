<script lang="ts">
  interface Example {
    href: string;
    name: string;
  }

  const examples: Example[] = [
    {
      href: './basic',
      name: 'Basics'
    },
    {
      href: './canvas-svg',
      name: 'Canvas SVG'
    },
    {
      href: './dvd-bounce',
      name: 'DVD Bounce'
    },
    {
      href: './globe',
      name: 'Globe'
    },
    {
      href: './scatterplot',
      name: 'Scatterplot'
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
  <main class="container">
    {#each examples as { name, href }}
      <a class="example" {href}>{name}</a>
    {/each}
  </main>
</section>

<style>
  h1,
  a {
    font-family: Overpass, system-ui, sans-serif;
  }

  h1 {
    text-align: center;
    font-size: 4rem;
  }

  .wrapper {
    margin: auto;
    padding: 1.5rem;
    max-width: 60ch;
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
      rgba(64, 179, 255) 80%,
      rgba(255, 62, 0) 20%
    );
    background-position: 100%;
    transition: background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1),
      drop-shadow 0.6s linear;
    background-size: 800%;
    border-radius: 0.5rem;
    font-weight: bold;
    display: block;
    padding: 2rem;
    font-size: 1.2rem;
    font-weight: 300;
    border-radius: 4px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: white;
    text-align: center;
  }

  a.example:is(:hover, :focus-within) {
    box-shadow: 0 10px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
    background-position: 88%;
  }
</style>
