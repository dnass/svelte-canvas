<script>
  import { Layer } from "svelte-canvas";

  let gradient;

  const setup = ({ context, width, height }) => {
    const w = width / 2,
      h = height / 2;
    gradient = context.createRadialGradient(w, h, 0, w, h, height);
    gradient.addColorStop(0, "#222");
    gradient.addColorStop(1, "#000");
  };

  const render = ({ context, width, height }) => {
    context.globalCompositeOperation = "lighten";
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  };
</script>

<Layer {setup} {render} />
