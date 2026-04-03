import * as THREE from "three";

function createCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

/**
 * Creates a soft radial billboard texture used for cloud sprites.
 */
export function createCloudSpriteTexture() {
  const canvas = createCanvas(256);
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(128, 128, 18, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,0.98)");
  gradient.addColorStop(0.28, "rgba(252,254,255,0.88)");
  gradient.addColorStop(0.62, "rgba(241,248,255,0.46)");
  gradient.addColorStop(1, "rgba(232,243,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
