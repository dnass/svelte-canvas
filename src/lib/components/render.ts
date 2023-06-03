export interface Render {
  (props: {
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    time: number;
  }): void;
}
