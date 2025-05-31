// Pixel Column Scraper Effect
// Params: { frequency, randomness, fadeStyle }
export function distort(imgData, params) {
  const { frequency = 10, randomness = 0.5, fadeStyle = 'hard' } = params;
  const { width, height, data } = imgData;
  const out = new ImageData(width, height);
  for (let x = 0; x < width; x++) {
    let erase = Math.random() < randomness && (x % frequency === 0);
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      if (erase) {
        if (fadeStyle === 'soft') {
          let alpha = 1 - Math.abs(Math.sin((y / height) * Math.PI));
          out.data[i] = data[i];
          out.data[i + 1] = data[i + 1];
          out.data[i + 2] = data[i + 2];
          out.data[i + 3] = data[i + 3] * alpha;
        } else {
          out.data[i] = 0;
          out.data[i + 1] = 0;
          out.data[i + 2] = 0;
          out.data[i + 3] = 0;
        }
      } else {
        out.data[i] = data[i];
        out.data[i + 1] = data[i + 1];
        out.data[i + 2] = data[i + 2];
        out.data[i + 3] = data[i + 3];
      }
    }
  }
  return out;
} 