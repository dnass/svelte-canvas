<script>
  import { Canvas } from '$lib';
  import Background from './Background.svelte';
  import Logo from './Logo.svelte';
</script>

<Canvas style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 5px solid black; border-radius: 2rem;" width={960} height={640}>
  <Logo />
  <Background />
</Canvas>
