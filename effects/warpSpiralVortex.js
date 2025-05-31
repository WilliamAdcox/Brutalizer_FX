// Warp Spiral Vortex Effect
// Params: { vortexStrength, twistAmount }
export function distort(imgData, params) {
  const { vortexStrength = 0.5, twistAmount = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  const cx = width / 2, cy = height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx, dy = y - cy;
      let r = Math.sqrt(dx * dx + dy * dy);
      let angle = Math.atan2(dy, dx);
      r = r * (1 - vortexStrength * 0.5 * Math.sin(angle * twistAmount));
      angle += vortexStrength * Math.sin(r * 0.05) * twistAmount;
      const sx = Math.round(cx + r * Math.cos(angle));
      const sy = Math.round(cy + r * Math.sin(angle));
      if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
        const si = (sy * width + sx) * 4;
        const di = (y * width + x) * 4;
        out.data[di] = data[si];
        out.data[di + 1] = data[si + 1];
        out.data[di + 2] = data[si + 2];
        out.data[di + 3] = data[si + 3];
      }
    }
  }
  return out;
} 