<script>
  import DemoLayer from './DemoLayer.svelte';

  const pathString =
    'M26.8,-43.9C33.8,-37.1,38,-28.2,47,-18.5C56,-8.9,69.7,1.6,70.3,11.5C71,21.4,58.7,30.7,46,33C33.4,35.3,20.5,30.5,9.6,34.7C-1.4,38.8,-10.2,52,-18.9,54.1C-27.5,56.2,-35.9,47.3,-46.6,38.4C-57.3,29.6,-70.2,20.8,-68.1,12C-65.9,3.2,-48.6,-5.6,-40.9,-17.1C-33.2,-28.6,-35,-43,-29.8,-50.6C-24.5,-58.2,-12.3,-59.1,-1.2,-57.2C9.9,-55.4,19.7,-50.7,26.8,-43.9Z';
</script>

<DemoLayer
  name="Blob"
  render={({ context, width, height, active }) => {
    const path = new Path2D(pathString);
    context.fillStyle = 'mediumturquoise';
    context.translate(width * 0.85, height * 0.6);

    const scale = width * 0.0018;
    context.scale(scale, scale);
    context.fill(path);

    if (active()) {
      context.stroke(path);
    }
  }}
/>
