<script lang="ts">
  import 'svelte-highlight/styles/onedark.css';
  import Highlight, { HighlightSvelte } from 'svelte-highlight';
  import typescript from 'svelte-highlight/languages/typescript';

  export let files: string[] = [],
    text = '',
    lang = 'svelte',
    copy = false;

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
          class="tab"
          class:active={selectedFile === i}
          on:click={() => (selectedFile = i)}
        >
          {title}
        </button>
      {/each}
    </div>
  {/if}
  <div class="inner">
    {#if copy}
      <button
        class="copy"
        aria-label="Copy to clipboard"
        on:click={() => navigator.clipboard.writeText(code)}
      >
        <svg viewBox="0 0 32 32">
          <path
            d="m17.709 1.9941c-0.51479-8.807e-4 -1.0805 0.0058594-1.709 0.0058594h-4c-1.4978 0-2.6354-0.002642-3.5762 0.10352s-1.7668 0.33644-2.377 0.94727c-0.61012 0.61083-0.83978 1.4368-0.94531 2.377s-0.10156 2.0765-0.10156 3.5723v10a1.0001 1.0001 0 0 0 0 0.009766 1.0001 1.0001 0 0 0 0 0.011718c0 2.5474-0.1083 4.0675 0.58984 5.3379 0.34907 0.63518 0.97662 1.101 1.666 1.3242 0.53202 0.17225 1.1381 0.23738 1.8125 0.27734 0.013242 0.19927 0.01449 0.4321 0.035156 0.61523 0.10616 0.94072 0.33644 1.7668 0.94727 2.377 0.61083 0.61012 1.4368 0.83978 2.377 0.94531 0.94019 0.10553 2.0765 0.10156 3.5723 0.10156h4c1.4978 0 2.6354 0.0026 3.5762-0.10352 0.94072-0.10616 1.7668-0.33644 2.377-0.94726s0.83978-1.4368 0.94531-2.377c0.10553-0.94019 0.10156-2.0765 0.10156-3.5723v-10c0-1.4978 0.0026-2.6354-0.10352-3.5762-0.10616-0.94072-0.33644-1.7668-0.94726-2.377s-1.4368-0.83978-2.377-0.94531c-0.18849-0.021156-0.42724-0.021887-0.63281-0.035156-0.04161-0.70746-0.11126-1.3341-0.30273-1.8867-0.23402-0.67543-0.71468-1.2822-1.3477-1.6152-0.94946-0.49955-2.0357-0.56767-3.5801-0.57031zm-5.709 2.0059h4c2.513 0 3.9261 0.10706 4.3574 0.33398 0.21565 0.11346 0.27566 0.17381 0.38867 0.5 0.081847 0.23623 0.13914 0.65988 0.18164 1.1719-0.3111-9.989e-4 -0.57979-0.0058594-0.92773-0.0058594h-4c-1.4978 0-2.6354-0.002642-3.5762 0.10352s-1.7668 0.33644-2.377 0.94727c-0.61012 0.61083-0.83978 1.4368-0.94531 2.377-0.10553 0.94019-0.10156 2.0765-0.10156 3.5723v10c0 0.35612 0.0046599 0.63162 0.0058594 0.94922-0.48679-0.039688-0.89531-0.091073-1.1328-0.16797-0.34888-0.11296-0.41474-0.17827-0.5293-0.38672-0.22911-0.41689-0.34375-1.8274-0.34375-4.373a1.0001 1.0001 0 0 0 0 -0.009765 1.0001 1.0001 0 0 0 0 -0.011719v-10c0-1.4952 0.0061497-2.604 0.089844-3.3496 0.08369-0.74562 0.22984-1.0461 0.37109-1.1875 0.14126-0.14142 0.44176-0.28889 1.1875-0.37305 0.74574-0.084155 1.8548-0.089844 3.3516-0.089844zm4 4h4c1.4952 0 2.604 0.0061497 3.3496 0.089844 0.74562 0.08369 1.0461 0.22984 1.1875 0.37109 0.14142 0.14126 0.28889 0.44176 0.37305 1.1875 0.084155 0.74575 0.089844 1.8548 0.089844 3.3516v10c0 1.4952-0.006204 2.604-0.089844 3.3496-0.08369 0.74562-0.22984 1.0461-0.37109 1.1875-0.14126 0.14142-0.44175 0.28889-1.1875 0.37305-0.74575 0.084155-1.8548 0.089844-3.3516 0.089844h-4c-1.4952 0-2.604-0.006204-3.3496-0.089844-0.74562-0.08369-1.0461-0.22984-1.1875-0.37109-0.14142-0.14126-0.28889-0.44175-0.37305-1.1875-0.084155-0.74575-0.089844-1.8548-0.089844-3.3516v-10c0-1.4952 0.006204-2.604 0.089844-3.3496 0.08369-0.74562 0.22984-1.0461 0.37109-1.1875 0.14126-0.14142 0.44175-0.28889 1.1875-0.37305 0.74575-0.084155 1.8548-0.089844 3.3516-0.089844z"
          />
        </svg>
      </button>
    {/if}
    {#if lang === 'ts'}
      <Highlight {code} language={typescript} />
    {:else}
      <HighlightSvelte {code} />
    {/if}
  </div>
</div>

<style>
  .code {
    height: auto;
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    font-family: 'Fira Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.25;
    overflow-x: scroll;
    position: relative;
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
    background-color: transparent;
    border: none;
    font-family: monospace;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
  }

  .inner {
    position: relative;
  }

  .copy {
    position: absolute;
    z-index: 1;
    top: 0.5rem;
    right: 0.5rem;
    opacity: 0.7;
    aspect-ratio: 1;
    width: 2rem;
    border-radius: 2px;
    transition-property: opacity, background-color;
    transition-duration: 0.1s;
    transition-timing-function: ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  path {
    fill: var(--body);
  }

  .copy:hover {
    opacity: 1;
    background-color: var(--bg);
  }

  .tab {
    padding: 1rem;
    position: relative;
  }

  .tab:after {
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
