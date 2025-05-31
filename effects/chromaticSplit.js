// Chromatic Split Effect
// Params: { redX, redY, greenX, greenY, blueX, blueY, distortionStrength }
export function distort(imgData, params) {
  const {
    redX = 10, redY = 0,
    greenX = 0, greenY = 10,
    blueX = -10, blueY = 0,
    distortionStrength = 1
  } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  // Scale offsets by distortionStrength
  const rdx = Math.round(redX * distortionStrength), rdy = Math.round(redY * distortionStrength);
  const gdx = Math.round(greenX * distortionStrength), gdy = Math.round(greenY * distortionStrength);
  const bdx = Math.round(blueX * distortionStrength), bdy = Math.round(blueY * distortionStrength);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      // R
      let rx = x + rdx, ry = y + rdy;
      if (rx < 0) rx = 0; if (rx >= width) rx = width - 1;
      if (ry < 0) ry = 0; if (ry >= height) ry = height - 1;
      let ri = (ry * width + rx) * 4;
      // G
      let gx = x + gdx, gy = y + gdy;
      if (gx < 0) gx = 0; if (gx >= width) gx = width - 1;
      if (gy < 0) gy = 0; if (gy >= height) gy = height - 1;
      let gi = (gy * width + gx) * 4;
      // B
      let bx = x + bdx, by = y + bdy;
      if (bx < 0) bx = 0; if (bx >= width) bx = width - 1;
      if (by < 0) by = 0; if (by >= height) by = height - 1;
      let bi = (by * width + bx) * 4;
      out.data[i] = data[ri];
      out.data[i + 1] = data[gi + 1];
      out.data[i + 2] = data[bi + 2];
      out.data[i + 3] = data[i + 3];
    }
  }
  return out;
} 