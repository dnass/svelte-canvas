export const idToRgb = (id: number): string => {
  const r = (id >> 16) & 0xff;
  const g = (id >> 8) & 0xff;
  const b = id & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
};

export const rgbToId = (r: number, g: number, b: number): number =>
  (r << 16) | (g << 8) | b;
