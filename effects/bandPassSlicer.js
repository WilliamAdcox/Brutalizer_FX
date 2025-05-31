// Band-Pass Slicer Effect
// Params: { minLuminance, maxLuminance, softness }
export function distort(imgData, params) {
  const { minLuminance = 0.2, maxLuminance = 0.8, softness = 0.1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3 / 255;
      let alpha = 1;
      if (lum < minLuminance - softness || lum > maxLuminance + softness) alpha = 0;
      else if (lum < minLuminance + softness) alpha = (lum - (minLuminance - softness)) / (2 * softness);
      else if (lum > maxLuminance - softness) alpha = ((maxLuminance + softness) - lum) / (2 * softness);
      out.data[i] = data[i];
      out.data[i + 1] = data[i + 1];
      out.data[i + 2] = data[i + 2];
      out.data[i + 3] = data[i + 3] * alpha;
    }
  }
  return out;
} 