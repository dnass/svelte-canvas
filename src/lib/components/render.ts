export interface Render {
  (params: {
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
  }): void;
}
