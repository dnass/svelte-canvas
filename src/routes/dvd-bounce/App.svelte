<script>
  import { Canvas } from '$lib';
  import Background from './Background.svelte';
  import Logo from './Logo.svelte';
</script>

<Canvas width={960} height={640}>
  <Logo />
  <Background />
</Canvas>
