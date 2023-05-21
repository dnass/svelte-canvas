<script lang="ts">
  import { HighlightSvelte } from 'svelte-highlight';
  import 'svelte-highlight/styles/onedark.css';

  export let files: string[],
    transform: (code: string) => string = (code) => code;

  let contents: string[];

  let selectedFile = 0;

  $: titles = files.map((name) => name.split('/').pop());

  Promise.all(
    files.map(
      (file) => import(/* @vite-ignore */ `../_pages/examples/${file}?raw`),
    ),
  ).then((modules) => {
    contents = modules.map((module) => {
      const content = module.default.trim().replace('$lib', 'svelte-canvas');
      return transform(content);
    });
  });
</script>

{#if contents}
  <div class="code">
    <div class="hljs title">
      {#each titles as title, i}
        <button
          class:active={selectedFile === i}
          on:click={() => (selectedFile = i)}>{title}</button
        >
      {/each}
    </div>
    <HighlightSvelte code={contents[selectedFile]} />
  </div>
{/if}

<style>
  .code {
    height: auto;
    width: 100%;
    max-width: 800px;
    border-radius: 4px;
    overflow: hidden;
    font-size: 1rem;
    line-height: 1.25;
  }

  :global(.code pre) {
    margin: 0;
  }

  .title {
    position: relative;
  }

  button {
    appearance: none;
    padding: 1rem;
    background-color: transparent;
    border: none;
    font-family: monospace;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    position: relative;
  }

  button:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 4px;
    left: 0;
    bottom: 0;
  }

  button:not(.active):hover:after {
    background-color: rgba(255, 255, 255, 0.25);
  }

  .active:after {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .title:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
</style>
