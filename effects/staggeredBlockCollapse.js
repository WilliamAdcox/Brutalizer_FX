// Staggered Block Collapse Effect
// Params: { blockSize, collapse, strength }
export function distort(imgData, params) {
  const { blockSize = 32, collapse = 32, strength = 1 } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  
  // Scale collapse amount by strength
  const scaledCollapse = collapse * strength;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate block position
      const blockX = Math.floor(x / blockSize);
      const blockY = Math.floor(y / blockSize);
      
      // Calculate collapse offset
      const offset = blockY % 2 === 0 ? 
        Math.floor(scaledCollapse * (blockX / Math.ceil(width / blockSize))) :
        Math.floor(scaledCollapse * (1 - blockX / Math.ceil(width / blockSize)));
      
      // Apply offset
      let sx = x - offset;
      let sy = y;
      
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