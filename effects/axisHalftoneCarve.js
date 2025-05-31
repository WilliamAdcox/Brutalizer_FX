// Axis-Aligned Halftone Carve Effect
// Params: { orientation, barThickness, contrastBoost }
export function distort(imgData, params) {
  const { orientation = 'horizontal', barThickness = 8, contrastBoost = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255;
      let bar = 0;
      if (orientation === 'horizontal') {
        bar = Math.floor(y / barThickness) % 2;
      } else {
        bar = Math.floor(x / barThickness) % 2;
      }
      let mask = (lum * contrastBoost > 0.5) ? 1 : 0;
      mask = mask === bar ? 1 : 0;
      out.data[i] = data[i] * mask;
      out.data[i + 1] = data[i + 1] * mask;
      out.data[i + 2] = data[i + 2] * mask;
      out.data[i + 3] = data[i + 3];
    }
  }
  return out;
} 