// Inset Frame Crunch Effect
// Params: { frameThickness, crunchAmount, cornerMode, strength }
export function distort(imgData, params) {
  const { 
    frameThickness = 32, 
    crunchAmount = 16, 
    cornerMode = 'square',
    strength = 1 
  } = params;
  
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  
  // Scale parameters by strength
  const scaledFrameThickness = Math.floor(frameThickness * strength);
  const scaledCrunchAmount = Math.floor(crunchAmount * strength);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let inFrame = (
        x >= scaledFrameThickness && x < width - scaledFrameThickness &&
        y >= scaledFrameThickness && y < height - scaledFrameThickness
      );
      
      let sx = x, sy = y;
      
      if (!inFrame) {
        if (cornerMode === 'square') {
          // Square mode: crunch toward nearest edge
          if (x < scaledFrameThickness) {
            sx = Math.max(0, x - scaledCrunchAmount);
          } else if (x >= width - scaledFrameThickness) {
            sx = Math.min(width - 1, x + scaledCrunchAmount);
          }
          
          if (y < scaledFrameThickness) {
            sy = Math.max(0, y - scaledCrunchAmount);
          } else if (y >= height - scaledFrameThickness) {
            sy = Math.min(height - 1, y + scaledCrunchAmount);
          }
        } else {
          // Round mode: crunch toward center
          const cx = width / 2, cy = height / 2;
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.min(width, height) / 2;
          
          if (dist > 0) {
            const scale = 1 - (scaledCrunchAmount / maxDist);
            sx = Math.round(cx + dx * scale);
            sy = Math.round(cy + dy * scale);
          }
        }
      }
      
      // Clamp coordinates
      sx = Math.max(0, Math.min(width - 1, sx));
      sy = Math.max(0, Math.min(height - 1, sy));
      
      // Copy pixel data
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