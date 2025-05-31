// Moiré Overlay Effect
// Params: { type, frequency, blendMode }
export function distort(imgData, params) {
  const { type = 'lines', frequency = 20, blendMode = 'multiply' } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      let pattern = 1;
      if (type === 'lines') {
        pattern = 0.5 + 0.5 * Math.sin((y / height) * frequency * Math.PI * 2);
      } else {
        // circles
        const cx = width / 2, cy = height / 2;
        const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        pattern = 0.5 + 0.5 * Math.sin(r / width * frequency * Math.PI * 2);
      }
      // Blend
      let r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (blendMode === 'multiply') {
        r *= pattern;
        g *= pattern;
        b *= pattern;
      } else if (blendMode === 'screen') {
        r = 255 - (255 - r) * (1 - pattern);
        g = 255 - (255 - g) * (1 - pattern);
        b = 255 - (255 - b) * (1 - pattern);
      } else if (blendMode === 'overlay') {
        r = r < 128 ? 2 * r * pattern : 255 - 2 * (255 - r) * (1 - pattern);
        g = g < 128 ? 2 * g * pattern : 255 - 2 * (255 - g) * (1 - pattern);
        b = b < 128 ? 2 * b * pattern : 255 - 2 * (255 - b) * (1 - pattern);
      }
      out.data[i] = Math.max(0, Math.min(255, r));
      out.data[i + 1] = Math.max(0, Math.min(255, g));
      out.data[i + 2] = Math.max(0, Math.min(255, b));
      out.data[i + 3] = a;
    }
  }
  return out;
} 