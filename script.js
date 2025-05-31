// Brutalizer: Modular Graphic Distortion Tool
// Main script.js (ESM)

import { distort as sinusoidalWarp } from './effects/sinusoidalWarp.js';
import { distort as staggeredBlockCollapse } from './effects/staggeredBlockCollapse.js';
import { distort as spiralTwist } from './effects/spiralTwist.js';
import { distort as gridShearGlitch } from './effects/gridShearGlitch.js';
import { distort as chromaticSplit } from './effects/chromaticSplit.js';
import { distort as blockQuantize } from './effects/blockQuantize.js';
import { distort as featheredWipeout } from './effects/featheredWipeout.js';
import { distort as scanlineDropout } from './effects/scanlineDropout.js';
import { distort as radialPanelBender } from './effects/radialPanelBender.js';
import { distort as warpSpiralVortex } from './effects/warpSpiralVortex.js';
import { distort as moireOverlay } from './effects/moireOverlay.js';
import { distort as axisHalftoneCarve } from './effects/axisHalftoneCarve.js';
import { distort as pixelColumnScraper } from './effects/pixelColumnScraper.js';
import { distort as hardMaskCutout } from './effects/hardMaskCutout.js';
import { distort as insetFrameCrunch } from './effects/insetFrameCrunch.js';
import { distort as textureInjectionMap } from './effects/textureInjectionMap.js';
import { distort as directionalDragWarp } from './effects/directionalDragWarp.js';
import { distort as bandPassSlicer } from './effects/bandPassSlicer.js';
import { distort as radialGridCutter } from './effects/radialGridCutter.js';
import { distort as recursiveThresholdCollapse } from './effects/recursiveThresholdCollapse.js';

const canvas = document.getElementById('brutalizer-canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

const imageUpload = document.getElementById('image-upload');
const fallbackText = document.getElementById('fallback-text');
const effectSelect = document.getElementById('effect-select');
const distortionStrengthInput = document.getElementById('distortion-strength');
const effectParamsDiv = document.getElementById('effect-params');
const resetBtn = document.getElementById('reset-btn');
const exportBtn = document.getElementById('export-btn');
const fontSelect = document.getElementById('font-select');
const fontSizeSelect = document.getElementById('font-size-select');

const BASE_SIZE = 512;
canvas.width = BASE_SIZE * dpr;
canvas.height = BASE_SIZE * dpr;
canvas.style.width = '100%';
canvas.style.height = '100%';

let baseImage = null;
let baseImageData = null;
let imgPos = { x: 0, y: 0 };
let drag = { active: false, offsetX: 0, offsetY: 0 };
let currentEffect = null;
let currentEffectParams = {};
let fallbackFont = fontSelect ? fontSelect.value : 'Inter, Arial, sans-serif';
let fallbackFontSize = fontSizeSelect ? parseInt(fontSizeSelect.value, 10) : 128;

// --- Effect Registry ---
const EFFECTS = [
  {
    name: 'Sinusoidal Warp',
    id: 'sinusoidalWarp',
    fn: sinusoidalWarp,
    usesDistortionStrength: true,
    params: [
      { key: 'freq', label: 'Frequency', type: 'number', value: 4, step: 0.1 },
      { key: 'axis', label: 'Axis', type: 'select', options: ['x', 'y'], value: 'x' },
      { key: 'phase', label: 'Phase', type: 'number', value: 0, step: 0.1 }
    ]
  },
  {
    name: 'Staggered Block Collapse',
    id: 'staggeredBlockCollapse',
    fn: staggeredBlockCollapse,
    usesDistortionStrength: false,
    params: [
      { key: 'blockSize', label: 'Block Size', type: 'number', value: 32, step: 1 },
      { key: 'collapse', label: 'Collapse Strength', type: 'number', value: 32, step: 1 }
    ]
  },
  {
    name: 'Spiral Twist',
    id: 'spiralTwist',
    fn: spiralTwist,
    usesDistortionStrength: false,
    params: [
      { key: 'twistStrength', label: 'Twist Strength', type: 'number', value: 1, step: 0.01, min: 0, max: 10 },
      { key: 'rotationFalloff', label: 'Rotation Falloff', type: 'number', value: 1, step: 0.01, min: 0, max: 10 }
    ]
  },
  {
    name: 'Grid Shear Glitch',
    id: 'gridShearGlitch',
    fn: gridShearGlitch,
    usesDistortionStrength: true,
    params: [
      { key: 'blockSize', label: 'Block Size', type: 'number', value: 32, step: 1 },
      { key: 'xOffset', label: 'X Offset', type: 'number', value: 10, step: 1 },
      { key: 'yOffset', label: 'Y Offset', type: 'number', value: 10, step: 1 }
    ]
  },
  {
    name: 'Chromatic Split',
    id: 'chromaticSplit',
    fn: chromaticSplit,
    usesDistortionStrength: false,
    params: [
      { key: 'redX', label: 'Red X Offset', type: 'number', value: 10, step: 1 },
      { key: 'redY', label: 'Red Y Offset', type: 'number', value: 0, step: 1 },
      { key: 'greenX', label: 'Green X Offset', type: 'number', value: 0, step: 1 },
      { key: 'greenY', label: 'Green Y Offset', type: 'number', value: 10, step: 1 },
      { key: 'blueX', label: 'Blue X Offset', type: 'number', value: -10, step: 1 },
      { key: 'blueY', label: 'Blue Y Offset', type: 'number', value: 0, step: 1 }
    ]
  },
  {
    name: 'Block Quantize Rasterizer',
    id: 'blockQuantize',
    fn: blockQuantize,
    usesDistortionStrength: false,
    params: [
      { key: 'blockSize', label: 'Block Size', type: 'number', value: 8, step: 1 },
      { key: 'levels', label: 'Levels', type: 'number', value: 4, step: 1 }
    ]
  },
  {
    name: 'Feathered Wipeout',
    id: 'featheredWipeout',
    fn: featheredWipeout,
    usesDistortionStrength: false,
    params: [
      { key: 'type', label: 'Type', type: 'select', options: ['radial', 'linear'], value: 'radial' },
      { key: 'featherAmount', label: 'Feather Amount', type: 'number', value: 0.5, step: 0.01 },
      { key: 'centerX', label: 'Center X', type: 'number', value: 0.5, step: 0.01 },
      { key: 'centerY', label: 'Center Y', type: 'number', value: 0.5, step: 0.01 }
    ]
  },
  {
    name: 'Scanline Dropout',
    id: 'scanlineDropout',
    fn: scanlineDropout,
    usesDistortionStrength: false,
    params: [
      { key: 'interval', label: 'Interval', type: 'number', value: 3, step: 1 },
      { key: 'offset', label: 'Offset', type: 'number', value: 0, step: 1 }
    ]
  },
  {
    name: 'Radial Panel Bender',
    id: 'radialPanelBender',
    fn: radialPanelBender,
    usesDistortionStrength: false,
    params: [
      { key: 'wedgeCount', label: 'Wedge Count', type: 'number', value: 8, step: 1 },
      { key: 'bendAmount', label: 'Bend Amount', type: 'number', value: 0.5, step: 0.01 }
    ]
  },
  {
    name: 'Warp Spiral Vortex',
    id: 'warpSpiralVortex',
    fn: warpSpiralVortex,
    usesDistortionStrength: false,
    params: [
      { key: 'vortexStrength', label: 'Vortex Strength', type: 'number', value: 0.5, step: 0.01 },
      { key: 'twistAmount', label: 'Twist Amount', type: 'number', value: 1, step: 0.01 }
    ]
  },
  {
    name: 'Moiré Interference Synth',
    id: 'moireOverlay',
    fn: moireOverlay,
    usesDistortionStrength: false,
    params: [
      { key: 'type', label: 'Type', type: 'select', options: ['lines', 'circles'], value: 'lines' },
      { key: 'frequency', label: 'Frequency', type: 'number', value: 20, step: 1 },
      { key: 'blendMode', label: 'Blend Mode', type: 'select', options: ['multiply', 'screen', 'overlay'], value: 'multiply' }
    ]
  },
  {
    name: 'Axis-Aligned Halftone Carve',
    id: 'axisHalftoneCarve',
    fn: axisHalftoneCarve,
    usesDistortionStrength: false,
    params: [
      { key: 'orientation', label: 'Orientation', type: 'select', options: ['horizontal', 'vertical'], value: 'horizontal' },
      { key: 'barThickness', label: 'Bar Thickness', type: 'number', value: 8, step: 1 },
      { key: 'contrastBoost', label: 'Contrast Boost', type: 'number', value: 1, step: 0.01 }
    ]
  },
  {
    name: 'Pixel Column Scraper',
    id: 'pixelColumnScraper',
    fn: pixelColumnScraper,
    usesDistortionStrength: false,
    params: [
      { key: 'frequency', label: 'Frequency', type: 'number', value: 10, step: 1 },
      { key: 'randomness', label: 'Randomness', type: 'number', value: 0.5, step: 0.01 },
      { key: 'fadeStyle', label: 'Fade Style', type: 'select', options: ['hard', 'soft'], value: 'hard' }
    ]
  },
  {
    name: 'Hard Mask Cutout Generator',
    id: 'hardMaskCutout',
    fn: hardMaskCutout,
    usesDistortionStrength: false,
    params: [
      { key: 'threshold', label: 'Threshold', type: 'number', value: 128, step: 1 },
      { key: 'invert', label: 'Invert', type: 'checkbox', value: false }
    ]
  },
  {
    name: 'Inset Frame Crunch',
    id: 'insetFrameCrunch',
    fn: insetFrameCrunch,
    usesDistortionStrength: false,
    params: [
      { key: 'frameThickness', label: 'Frame Thickness', type: 'number', value: 32, step: 1 },
      { key: 'crunchAmount', label: 'Crunch Amount', type: 'number', value: 16, step: 1 },
      { key: 'cornerMode', label: 'Corner Mode', type: 'select', options: ['square', 'round'], value: 'square' }
    ]
  },
  {
    name: 'Texture Injection Map',
    id: 'textureInjectionMap',
    fn: textureInjectionMap,
    usesDistortionStrength: false,
    params: [
      { key: 'textureType', label: 'Texture Type', type: 'select', options: ['noise', 'grid'], value: 'noise' },
      { key: 'opacity', label: 'Opacity', type: 'number', value: 0.5, step: 0.01 },
      { key: 'blendMode', label: 'Blend Mode', type: 'select', options: ['multiply', 'screen', 'overlay'], value: 'multiply' }
    ]
  },
  {
    name: 'Directional Drag Warp',
    id: 'directionalDragWarp',
    fn: directionalDragWarp,
    usesDistortionStrength: false,
    params: [
      { key: 'direction', label: 'Direction (deg)', type: 'number', value: 0, step: 1 },
      { key: 'dragStrength', label: 'Drag Strength', type: 'number', value: 20, step: 1 },
      { key: 'curveAmount', label: 'Curve Amount', type: 'number', value: 0.5, step: 0.01 }
    ]
  },
  {
    name: 'Band-Pass Slicer',
    id: 'bandPassSlicer',
    fn: bandPassSlicer,
    usesDistortionStrength: false,
    params: [
      { key: 'minLuminance', label: 'Min Luminance', type: 'number', value: 0.2, step: 0.01 },
      { key: 'maxLuminance', label: 'Max Luminance', type: 'number', value: 0.8, step: 0.01 },
      { key: 'softness', label: 'Softness', type: 'number', value: 0.1, step: 0.01 }
    ]
  },
  {
    name: 'Radial Grid Cutter',
    id: 'radialGridCutter',
    fn: radialGridCutter,
    usesDistortionStrength: false,
    params: [
      { key: 'ringCount', label: 'Ring Count', type: 'number', value: 8, step: 1 },
      { key: 'angleDivisions', label: 'Angle Divisions', type: 'number', value: 12, step: 1 }
    ]
  },
  {
    name: 'Recursive Threshold Collapse',
    id: 'recursiveThresholdCollapse',
    fn: recursiveThresholdCollapse,
    usesDistortionStrength: false,
    params: [
      { key: 'passes', label: 'Passes', type: 'number', value: 3, step: 1 },
      { key: 'thresholdDelta', label: 'Threshold Delta', type: 'number', value: 16, step: 1 },
      { key: 'noiseAmount', label: 'Noise Amount', type: 'number', value: 0.1, step: 0.01 }
    ]
  }
];

// --- UI Setup ---
function populateEffectDropdown() {
  effectSelect.innerHTML = '';
  EFFECTS.forEach(eff => {
    const opt = document.createElement('option');
    opt.value = eff.id;
    opt.textContent = eff.name;
    effectSelect.appendChild(opt);
  });
}

function renderEffectParamsUI(effect) {
  effectParamsDiv.innerHTML = '';
  if (!effect || !effect.params) return;
  
  effect.params.forEach(param => {
    const label = document.createElement('label');
    label.textContent = param.label;
    let input;
    
    switch (param.type) {
      case 'select':
        input = document.createElement('select');
        param.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          input.appendChild(option);
        });
        input.value = currentEffectParams[param.key] ?? param.value;
        break;
        
      case 'checkbox':
        input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = currentEffectParams[param.key] ?? param.value;
        break;
        
      case 'number':
        input = document.createElement('input');
        input.type = 'number';
        input.value = currentEffectParams[param.key] ?? param.value;
        if (param.step) input.step = param.step;
        if (param.min !== undefined) input.min = param.min;
        if (param.max !== undefined) input.max = param.max;
        break;
        
      default:
        input = document.createElement('input');
        input.type = param.type;
        input.value = currentEffectParams[param.key] ?? param.value;
    }
    
    // Set initial param value if not set
    if (!(param.key in currentEffectParams)) {
      currentEffectParams[param.key] = param.value;
    }
    
    // Add change event listener for immediate updates
    input.addEventListener('input', () => {
      currentEffectParams[param.key] = input.type === 'checkbox' ? input.checked :
                                     input.type === 'number' ? parseFloat(input.value) :
                                     input.value;
      renderDistorted();
    });
    
    label.appendChild(input);
    effectParamsDiv.appendChild(label);
  });

  // Show/hide distortion strength slider
  if (effect && effect.usesDistortionStrength) {
    distortionStrengthInput.parentElement.style.display = '';
  } else {
    distortionStrengthInput.parentElement.style.display = 'none';
  }
}

// --- Image/Text Input ---
function drawFallbackText(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fallbackFontSize}px ${fallbackFont}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = 1;
  ctx.fillText(text || 'BRUTALIZER', canvas.width / 2, canvas.height / 2);
  ctx.globalAlpha = 1;
  baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imgPos = { x: 0, y: 0 };
}

function drawBaseImage(img, pos = { x: 0, y: 0 }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Transparent background
  ctx.globalAlpha = 1;
  // Fit image to canvas
  const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
  const x = (canvas.width - img.width * scale) / 2 + pos.x;
  const y = (canvas.height - img.height * scale) / 2 + pos.y;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  imgPos = { x: pos.x, y: pos.y };
}

imageUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new window.Image();
  img.onload = () => {
    baseImage = img;
    drawBaseImage(img);
    renderDistorted();
  };
  img.src = URL.createObjectURL(file);
});

fallbackText.addEventListener('input', () => {
  if (!baseImage) {
    drawFallbackText(fallbackText.value);
    renderDistorted();
  }
});

resetBtn.addEventListener('click', () => {
  baseImage = null;
  imageUpload.value = '';
  // Reset fallback font dropdown and size to default
  if (fontSelect) fontSelect.value = 'Inter, Arial, sans-serif';
  if (fontSizeSelect) fontSizeSelect.value = '128';
  fallbackFont = fontSelect ? fontSelect.value : 'Inter, Arial, sans-serif';
  fallbackFontSize = fontSizeSelect ? parseInt(fontSizeSelect.value, 10) : 128;
  // Reset fallback text
  drawFallbackText(fallbackText.value);
  // Reset effect parameters to defaults
  currentEffectParams = {};
  currentEffect = EFFECTS.find(e => e.id === effectSelect.value);
  // Reset distortion strength to default
  distortionStrengthInput.value = 50;
  // Re-render effect parameter UI and distortion slider visibility
  renderEffectParamsUI(currentEffect);
  // Re-render effect
  renderDistorted();
});

// --- Canvas Drag (optional) ---
canvas.addEventListener('mousedown', e => {
  if (!baseImage) return;
  drag.active = true;
  drag.offsetX = e.offsetX * dpr - imgPos.x;
  drag.offsetY = e.offsetY * dpr - imgPos.y;
});
canvas.addEventListener('mousemove', e => {
  if (!drag.active || !baseImage) return;
  const x = e.offsetX * dpr - drag.offsetX;
  const y = e.offsetY * dpr - drag.offsetY;
  drawBaseImage(baseImage, { x, y });
  renderDistorted();
});
canvas.addEventListener('mouseup', () => { drag.active = false; });
canvas.addEventListener('mouseleave', () => { drag.active = false; });

// --- Effect Application ---
function getAllParams() {
  const strength = parseFloat(distortionStrengthInput.value) / 100; // Normalize to 0-1
  return { strength, ...currentEffectParams };
}

async function renderDistorted() {
  if (!baseImageData) return;
  
  const effectId = effectSelect.value;
  const effect = EFFECTS.find(e => e.id === effectId);
  if (!effect || typeof effect.fn !== 'function') return;
  
  // Get all parameters including strength
  const params = getAllParams();
  
  // Apply the effect
  const result = effect.fn(baseImageData, params);
  
  // Update canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(result, 0, 0);
}

// Add effect change handler
effectSelect.addEventListener('change', () => {
  const effectId = effectSelect.value;
  currentEffect = EFFECTS.find(e => e.id === effectId);
  currentEffectParams = {}; // Reset params when effect changes
  renderEffectParamsUI(currentEffect);
  renderDistorted();
});

// Add strength change handler
distortionStrengthInput.addEventListener('input', renderDistorted);

// --- Export ---
exportBtn.addEventListener('click', () => {
  // Export at 2x resolution, transparent PNG
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width * 2;
  exportCanvas.height = canvas.height * 2;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
  exportCanvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'brutalizer.png';
    a.click();
  }, 'image/png');
});

// --- Init ---
function init() {
  populateEffectDropdown();
  currentEffect = EFFECTS[0];
  renderEffectParamsUI(currentEffect);
  drawFallbackText(fallbackText.value);
  renderDistorted();
}

window.addEventListener('resize', () => {
  const size = Math.min(window.innerWidth, window.innerHeight, 512);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = '';
  canvas.style.height = '';
  if (baseImage) {
    drawBaseImage(baseImage, imgPos);
  } else {
    drawFallbackText(fallbackText.value);
  }
  renderDistorted();
});

if (fontSelect) {
  fontSelect.addEventListener('change', () => {
    fallbackFont = fontSelect.value;
    if (!baseImage) {
      drawFallbackText(fallbackText.value);
      renderDistorted();
    }
  });
}
if (fontSizeSelect) {
  fontSizeSelect.addEventListener('change', () => {
    fallbackFontSize = parseInt(fontSizeSelect.value, 10);
    if (!baseImage) {
      drawFallbackText(fallbackText.value);
      renderDistorted();
    }
  });
}

init();
