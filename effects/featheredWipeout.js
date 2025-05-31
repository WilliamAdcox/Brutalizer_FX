// Feathered Wipeout Effect
// Params: { type, featherAmount, centerX, centerY, distortionStrength }
export function distort(imgData, params) {
  const { type = 'radial', featherAmount = 0.5, centerX = 0.5, centerY = 0.5, distortionStrength = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  const cx = width * centerX;
  const cy = height * centerY;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  // Scale featherAmount by distortionStrength
  const scaledFeather = Math.max(0.01, Math.min(1, featherAmount * distortionStrength));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      let alpha = 1;
      if (type === 'radial') {
        const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        alpha = 1 - Math.min(1, Math.max(0, (r - maxR * (1 - scaledFeather)) / (maxR * scaledFeather)));
      } else {
        // linear: fade from left to right
        alpha = 1 - Math.min(1, Math.max(0, (x - width * (1 - scaledFeather)) / (width * scaledFeather)));
      }
      out.data[i] = data[i];
      out.data[i + 1] = data[i + 1];
      out.data[i + 2] = data[i + 2];
      out.data[i + 3] = data[i + 3] * alpha;
    }
  }
  return out;
} 