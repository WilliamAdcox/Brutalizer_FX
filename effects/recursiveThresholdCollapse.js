// Recursive Threshold Collapse Effect
// Params: { passes, thresholdDelta, noiseAmount }
export function distort(imgData, params) {
  const { passes = 3, thresholdDelta = 16, noiseAmount = 0.1 } = params;
  const { width, height, data } = imgData;
  let out = new ImageData(new Uint8ClampedArray(data), width, height);
  for (let p = 0; p < passes; p++) {
    const threshold = 128 + (p - Math.floor(passes / 2)) * thresholdDelta;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const lum = (out.data[i] + out.data[i + 1] + out.data[i + 2]) / 3 + (Math.random() - 0.5) * noiseAmount * 255;
        let mask = lum > threshold ? 255 : 0;
        out.data[i] = mask;
        out.data[i + 1] = mask;
        out.data[i + 2] = mask;
        // alpha stays
      }
    }
  }
  return out;
} 