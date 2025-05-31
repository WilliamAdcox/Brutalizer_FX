// Radial Grid Cutter Effect
// Params: { ringCount, angleDivisions }
export function distort(imgData, params) {
  const { ringCount = 8, angleDivisions = 12 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  const cx = width / 2, cy = height / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx, dy = y - cy;
      let r = Math.sqrt(dx * dx + dy * dy);
      let angle = Math.atan2(dy, dx);
      // Snap radius and angle
      let rSnap = Math.round(r / maxR * (ringCount - 1)) / (ringCount - 1) * maxR;
      let aSnap = Math.round(angle / (2 * Math.PI) * angleDivisions) / angleDivisions * 2 * Math.PI;
      const sx = Math.round(cx + rSnap * Math.cos(aSnap));
      const sy = Math.round(cy + rSnap * Math.sin(aSnap));
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