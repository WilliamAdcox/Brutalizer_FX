// Sinusoidal Warp Effect
// Params: { freq, axis, phase, strength }
export function distort(imgData, params) {
  const { freq = 4, axis = 'x', phase = 0, strength = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  
  // Scale frequency and phase by strength
  const scaledFreq = freq * strength;
  const scaledPhase = phase * strength;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sx = x, sy = y;
      
      if (axis === 'x') {
        const wave = Math.sin((y / height) * Math.PI * 2 * scaledFreq + scaledPhase);
        sx = x + wave * width * 0.1 * strength;
      } else {
        const wave = Math.sin((x / width) * Math.PI * 2 * scaledFreq + scaledPhase);
        sy = y + wave * height * 0.1 * strength;
      }
      
      // Clamp coordinates
      sx = Math.max(0, Math.min(width - 1, sx));
      sy = Math.max(0, Math.min(height - 1, sy));
      
      // Copy pixel data
      const si = (Math.floor(sy) * width + Math.floor(sx)) * 4;
      const di = (y * width + x) * 4;
      out.data[di] = data[si];
      out.data[di + 1] = data[si + 1];
      out.data[di + 2] = data[si + 2];
      out.data[di + 3] = data[si + 3];
    }
  }
  
  return out;
} 