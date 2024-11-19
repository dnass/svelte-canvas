<script lang="ts">
  import './page.css';
  import { page } from '$app/stores';
  import { browser, version } from '$app/environment';
  import NavMenu, { type NavItems } from './NavMenu.svelte';
  import type { Snippet } from 'svelte';

  let {
    data,
    title,
    children,
  }: { data: { menu: NavItems }; title: string; children: Snippet } = $props();

  let menuVisible = $state(false);
  let article = $derived(!$page.url.pathname.includes('/examples/'));

  $effect(() => {
    $page;
    menuVisible = false;
  });

  $effect(() => {
    if (!browser) return;
    document.body.style.overflow = menuVisible ? 'hidden' : 'auto';
  });
</script>

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Mono&family=Source+Sans+3:wght@400;600;800&display=swap');
  </style>

  <title>{title} • svelte-canvas</title>
</svelte:head>

<div class="page">
  <nav>
    <div class="header">
      <button
        aria-expanded={menuVisible}
        aria-label="Toggle menu"
        onclick={() => (menuVisible = !menuVisible)}
      >
        <svg viewBox="0 0 24 24">
          <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" />
          <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" />
        </svg>
      </button>
      <h1>
        <a href="/svelte-canvas">svelte-canvas</a>
        <a
          target="_blank"
          href="https://github.com/dnass/svelte-canvas/blob/master/CHANGELOG.md"
        >
          <span>
            {version}
          </span>
        </a>
      </h1>
      <a
        class="github"
        target="_blank"
        href="https://github.com/dnass/svelte-canvas"
        aria-label="GitHub"
      >
        <svg viewBox="0 0 98 96">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
    <div class="menu" class:visible={menuVisible}>
      <NavMenu items={data.menu} />
    </div>
  </nav>

  <main class:article>
    {@render children()}
  </main>
</div>

<style>
  .page {
    position: relative;
  }

  nav {
    display: flex;
    gap: 0.33rem;
    flex-direction: column;
  }

  .header {
    top: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  button {
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    line-height: 0;
    color: var(--secondary);
    cursor: pointer;
  }

  button:hover,
  button:active {
    color: var(--primary);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  line {
    stroke-width: 3;
    stroke-linecap: round;
  }

  .github {
    line-height: 0;
    margin-left: auto;
  }

  h1 span {
    font-size: 0.8rem;
  }

  main {
    width: 100%;
    max-width: 100%;
    min-height: calc(100vh - var(--header-offset, 0vh));
    display: grid;
    grid-template-columns: minmax(auto, 80ch);
    grid-auto-rows: min-content;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 2rem;
    background-color: var(--bg);
    padding: 1.5rem 1.5rem 2rem;
  }

  .article {
    gap: 1rem;
  }

  @media (max-width: 45rem) {
    .page {
      --header-pad: 0.75rem;
      --header-height: 2rem;
      --header-offset: calc(var(--header-height) + var(--header-pad) * 2);
    }

    .header {
      width: 100%;
      position: fixed;
      z-index: 1;
      padding: var(--header-pad) 1.5rem;
      background-color: var(--bg-dark);
      border-bottom: 1px solid var(--bg-light);
    }

    h1 {
      height: var(--header-height);
    }

    .menu,
    main {
      margin-top: var(--header-offset);
    }

    .menu {
      transform: translateX(-100%);
      opacity: 0;
      transition-property: transform, opacity, visibility;
      transition-duration: 0.2s;
      transition-timing-function: ease-in-out;
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: var(--bg);
      top: 0;
      z-index: 2;
      visibility: hidden;
      padding: 1rem 1.5rem;
    }

    .menu.visible {
      transform: none;
      visibility: visible;
      opacity: 1;
    }
  }

  @media (min-width: 45rem) {
    .page {
      --sidebar-width: max(25vw, 20rem);
      --gutter-width: 4rem;
      --margin-top: 4rem;

      display: grid;
      grid-template-columns: var(--sidebar-width) 1fr;
    }

    nav {
      position: fixed;
      top: var(--margin-top);
      right: 0;
      margin-right: calc(100% - var(--sidebar-width) + var(--gutter-width));
    }

    main {
      gap: 3rem;
      padding: var(--margin-top) 2rem 4rem var(--gutter-width);
      grid-column: 2;
      border-left: 1px solid var(--bg-light);
    }

    button {
      display: none;
    }
  }
</style>
