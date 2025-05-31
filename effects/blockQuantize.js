// Block Quantize Rasterizer Effect
// Params: { blockSize, levels, distortionStrength }
export function distort(imgData, params) {
  const { blockSize = 8, levels = 4, distortionStrength = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  // Scale blockSize and/or levels by distortionStrength
  const scaledBlockSize = Math.max(1, Math.round(blockSize * (0.5 + distortionStrength)));
  const scaledLevels = Math.max(2, Math.round(levels * (0.5 + distortionStrength)));
  function quantize(v) {
    return Math.round(v / 255 * (scaledLevels - 1)) * Math.round(255 / (scaledLevels - 1));
  }
  for (let by = 0; by < height; by += scaledBlockSize) {
    for (let bx = 0; bx < width; bx += scaledBlockSize) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let y = 0; y < scaledBlockSize; y++) {
        for (let x = 0; x < scaledBlockSize; x++) {
          const px = bx + x, py = by + y;
          if (px >= width || py >= height) continue;
          const i = (py * width + px) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          count++;
        }
      }
      r = quantize(r / count);
      g = quantize(g / count);
      b = quantize(b / count);
      a = a / count;
      for (let y = 0; y < scaledBlockSize; y++) {
        for (let x = 0; x < scaledBlockSize; x++) {
          const px = bx + x, py = by + y;
          if (px >= width || py >= height) continue;
          const i = (py * width + px) * 4;
          out.data[i] = r;
          out.data[i + 1] = g;
          out.data[i + 2] = b;
          out.data[i + 3] = a;
        }
      }
    }
  }
  return out;
} 