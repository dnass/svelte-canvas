<script>
  import App from './App.svelte';
  import Code from '../../components/Code.svelte';
</script>

<div>
  <App />
</div>

<Code
  files={[
    'scatterplot/App.svelte',
    'scatterplot/Axis.svelte',
    'scatterplot/Point.svelte',
  ]}
/>

<style>
  div {
    max-width: 800px;
    width: 100%;
  }
</style>
