export const idToRgb = (id: number): string => {
  const id2 = id * 2;
  const r = (id2 >> 16) & 0xff;
  const g = (id2 >> 8) & 0xff;
  const b = id2 & 0xff;
  return `rgb(${r}, ${g}, ${b})`;
};

export const rgbToId = (r: number, g: number, b: number): number => {
  const id = ((r << 16) | (g << 8) | b) / 2;
  return id % 1 ? 0 : id;
};
