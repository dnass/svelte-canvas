<script>
  import { Canvas } from '$lib';
  import Background from './Background.svelte';
  import Logo from './Logo.svelte';
</script>

<Canvas width={960} height={640}>
  <Logo />
  <Background />
</Canvas>

<style global>
  html,
  body {
    position: relative;
    width: 100%;
    height: 100%;
  }

  body {
    color: #333;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
  }
</style>
