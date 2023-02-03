import type { ContextProxy } from '$lib/util/contextProxy';

export interface Render {
  (params: {
    context: CanvasRenderingContext2D | ContextProxy;
    width: number;
    height: number;
  }): void;
}
