// Texture Injection Map Effect
// Params: { textureType, opacity, blendMode }
export function distort(imgData, params) {
  const { textureType = 'noise', opacity = 0.5, blendMode = 'multiply' } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  function getTexture(x, y) {
    if (textureType === 'noise') {
      return Math.random();
    } else {
      // grid
      return ((Math.floor(x / 8) + Math.floor(y / 8)) % 2 === 0) ? 1 : 0;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const tex = getTexture(x, y) * opacity;
      let r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (blendMode === 'multiply') {
        r *= tex;
        g *= tex;
        b *= tex;
      } else if (blendMode === 'screen') {
        r = 255 - (255 - r) * (1 - tex);
        g = 255 - (255 - g) * (1 - tex);
        b = 255 - (255 - b) * (1 - tex);
      } else if (blendMode === 'overlay') {
        r = r < 128 ? 2 * r * tex : 255 - 2 * (255 - r) * (1 - tex);
        g = g < 128 ? 2 * g * tex : 255 - 2 * (255 - g) * (1 - tex);
        b = b < 128 ? 2 * b * tex : 255 - 2 * (255 - b) * (1 - tex);
      }
      out.data[i] = Math.max(0, Math.min(255, r));
      out.data[i + 1] = Math.max(0, Math.min(255, g));
      out.data[i + 2] = Math.max(0, Math.min(255, b));
      out.data[i + 3] = a;
    }
  }
  return out;
} 