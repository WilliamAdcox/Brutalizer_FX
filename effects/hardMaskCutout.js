// Hard Mask Cutout Generator
// Params: { threshold, invert }
export function distort(imgData, params) {
  const { threshold = 128, invert = false } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      let mask = lum > threshold ? 255 : 0;
      if (invert) mask = 255 - mask;
      out.data[i] = mask;
      out.data[i + 1] = mask;
      out.data[i + 2] = mask;
      out.data[i + 3] = data[i + 3];
    }
  }
  return out;
} 