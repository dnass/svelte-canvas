<script>
  import { Layer, t } from "svelte-canvas";

  const r = () => Math.random() * 200 + 55,
    randomColor = () => `rgb(${r()},${r()},${r()})`;

  const logo = new Image();
  logo.src = "https://upload.wikimedia.org/wikipedia/commons/9/9b/DVD_logo.svg";

  const w = 210,
    h = 107;

  let x = 0,
    y = 0,
    xflip = 1,
    yflip = 1,
    fill = randomColor();

  $: render =
    $t &&
    (({ context, width, height }) => {
      x += 5 * xflip;
      y += 5 * yflip;

      if (x <= 0 || x + w >= width) (xflip *= -1), (fill = randomColor());

      if (y <= 0 || y + h >= height) (yflip *= -1), (fill = randomColor());

      context.fillStyle = fill;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "destination-in";
      context.drawImage(logo, x, y, w, h);
    });
</script>

<Layer {render} />
