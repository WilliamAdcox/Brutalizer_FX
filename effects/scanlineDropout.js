// Scanline Dropout Effect
// Params: { interval, offset, distortionStrength }
export function distort(imgData, params) {
  const { interval = 2, offset = 0, distortionStrength = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  // Scale interval by distortionStrength (smaller interval = more dropout)
  const scaledInterval = Math.max(1, Math.round(interval / (0.5 + distortionStrength)));
  for (let y = 0; y < height; y++) {
    const drop = ((y + offset) % scaledInterval === 0);
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (drop) {
        out.data[i] = 0;
        out.data[i + 1] = 0;
        out.data[i + 2] = 0;
        out.data[i + 3] = 0;
      } else {
        out.data[i] = data[i];
        out.data[i + 1] = data[i + 1];
        out.data[i + 2] = data[i + 2];
        out.data[i + 3] = data[i + 3];
      }
    }
  }
  return out;
} 