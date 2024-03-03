import canvasSize from 'canvas-size';

const getMaxPixelRatio = (
  width: number,
  height: number,
  target: number,
  decrement: number = 0.1,
): number => {
  if (typeof window === 'undefined') return target;

  while (!canvasSize.test({ sizes: [[width * target, height * target]] })) {
    target -= decrement;
  }

  return target;
};

export { getMaxPixelRatio };
