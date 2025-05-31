// Directional Drag Warp Effect
// Params: { direction, dragStrength, curveAmount }
export function distort(imgData, params) {
  const { direction = 0, dragStrength = 20, curveAmount = 0.5 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  const rad = direction * Math.PI / 180;
  const dx = Math.cos(rad), dy = Math.sin(rad);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const curve = Math.sin((x / width) * Math.PI) * curveAmount;
      let sx = Math.round(x - dragStrength * dx * curve);
      let sy = Math.round(y - dragStrength * dy * curve);
      if (sx < 0) sx = 0; if (sx >= width) sx = width - 1;
      if (sy < 0) sy = 0; if (sy >= height) sy = height - 1;
      const si = (sy * width + sx) * 4;
      const di = (y * width + x) * 4;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = data[si + 3];
    }
  }
  return out;
} 