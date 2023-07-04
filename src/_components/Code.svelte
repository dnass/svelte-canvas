<script lang="ts">
  import Highlight, { HighlightSvelte } from 'svelte-highlight';
  import typescript from 'svelte-highlight/languages/typescript';
  import 'svelte-highlight/styles/onedark.css';

  export let files: string[] = [],
    text = '',
    lang = 'svelte';

  let contents: string[] = [];

  let selectedFile = 0;

  $: titles = files.map((name) => name.split('/').pop());

  $: code = contents.length ? contents[selectedFile] : text.trim();

  Promise.all(
    files.map((file) => {
      return import(/* @vite-ignore */ `../_pages/examples/${file}?raw`);
    }),
  ).then((modules) => {
    contents = modules.map((module) => {
      return module.default.trim().replace('$lib', 'svelte-canvas');
    });
  });
</script>

<div class="code">
  {#if contents}
    <div class="hljs title">
      {#each titles as title, i}
        <button
          class:active={selectedFile === i}
          on:click={() => (selectedFile = i)}>{title}</button
        >
      {/each}
    </div>
  {/if}
  {#if lang === 'ts'}
    <Highlight {code} language={typescript} />
  {:else}
    <HighlightSvelte {code} />
  {/if}
</div>

<style>
  .code {
    height: auto;
    width: 100%;
    max-width: 100ch;
    border-radius: 4px;
    overflow: hidden;
    font-size: 1rem;
    line-height: 1.25;
    overflow-x: scroll;
  }

  .code :global(pre) {
    margin: 0;
  }

  .code :global(code) {
    padding: 0.75rem;
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
