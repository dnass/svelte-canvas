export interface Render {
  (params: {
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
  }): void;
}

/**
  Utility function for reactive components
  For example:

  ```ts
  $: render = r(({ context, width, height }) => {
    // code...
  })
  ```
*/
export function r(render: Render): Render {
  return render;
}
