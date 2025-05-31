// Grid Shear Glitch Effect
// Params: { blockSize, xOffset, yOffset, strength }
export function distort(imgData, params) {
  const { blockSize = 32, xOffset = 10, yOffset = 10, strength = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  
  // Scale offsets by strength
  const scaledXOffset = xOffset * strength;
  const scaledYOffset = yOffset * strength;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate block position
      const blockX = Math.floor(x / blockSize);
      const blockY = Math.floor(y / blockSize);
      
      // Calculate offset based on block position
      const offsetX = blockX % 2 === 0 ? scaledXOffset : -scaledXOffset;
      const offsetY = blockY % 2 === 0 ? scaledYOffset : -scaledYOffset;
      
      // Apply offset
      let sx = x + offsetX;
      let sy = y + offsetY;
      
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