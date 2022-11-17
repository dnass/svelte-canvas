<script lang="ts">
  interface Example {
    href: string;
    name: string;
  }

  const examples: Example[] = [
    {
      href: "./basics",
      name: "Basics"
    },
    {
      href: "./canvas-svg",
      name: "Canvas SVG"
    },
    {
      href: "./dvd-bounce",
      name: "DVD Bounce"
    },
    {
      href: "./globe",
      name: "Globe"
    },
    {
      href: "./scatterplot",
      name: "Scatterplot"
    }
  ]
</script>

<div class="wrapper">
  <h1>Svelte Canvas</h1>
  <div class="container">
    {#each examples as { name, href }}
      <a class="example" {href}>{name}</a>
    {/each}
  </div>
</div>

<style>
  :root {
    --accent: 64,179,255,0.4;
    --accentBase: 64,179,255;
    --accent-gradient: linear-gradient(45deg, rgba(var(--accent)), rgba(255, 62, 0, 0.4) 30%, white 60%);
  }

  h1, a {
    font-family: system-ui, sans-serif;
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
    background-color: white;
		background-image: var(--accent-gradient);
		background-size: 400%;
		border-radius: 0.5rem;
		background-position: 100%;
		transition: background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    font-weight: bold;
    display: block;
    padding: 2rem;
    border: 1px solid black;
    border-radius: 4px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: #444;
    text-align: center;
  }

  a.example:is(:hover, :focus-within) {
		background-position: 0;
    border: 1px solid rgba(var(--accentBase), 25%);
	}
</style>
