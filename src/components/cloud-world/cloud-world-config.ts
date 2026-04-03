import * as THREE from "three";

/**
 * Shared tuning values for the CloudWorld landing scene.
 */
export const CLOUD_WORLD_CONFIG = {
  FORCE_QUALITY: null as null | "low" | "medium" | "high",
  camera: {
    fov: 68,
    near: 0.1,
    far: 900,
    driftSpeed: 0.72,
    parallaxStrength: 0.18,
    lookDamping: 0.045,
  },
  fog: {
    color: "#c8dff0",
    near: 200,
    far: 700,
  },
  lights: {
    ambient: 0.38,
    directional: 2.2,
    hemisphere: 0.28,
  },
  anchors: {
    logo: new THREE.Vector3(0, 42, -42),
    portal: new THREE.Vector3(0, 30, -88),
  },
} as const;

export const CLOUD_QUALITY_PRESETS = {
  low: {
    spriteCount: 15,
    floorSegments: 30,
    bloom: false,
    depthOfField: false,
  },
  medium: {
    spriteCount: 30,
    floorSegments: 60,
    bloom: true,
    depthOfField: false,
  },
  high: {
    spriteCount: 50,
    floorSegments: 80,
    bloom: true,
    depthOfField: true,
  },
} as const;

/**
 * Stable cloud placement used by the scene layers.
 */
export const CLOUD_CLUSTER_LAYOUT = [
  { position: [-82, -8, -80] as [number, number, number], scale: 22 },
  { position: [-34, -6, -54] as [number, number, number], scale: 18 },
  { position: [0, -10, -42] as [number, number, number], scale: 28 },
  { position: [42, -7, -62] as [number, number, number], scale: 19 },
  { position: [86, -9, -92] as [number, number, number], scale: 24 },
  { position: [-120, -12, -148] as [number, number, number], scale: 36 },
  { position: [-34, -16, -168] as [number, number, number], scale: 44 },
  { position: [54, -12, -154] as [number, number, number], scale: 32 },
  { position: [128, -18, -210] as [number, number, number], scale: 46 },
];

export const BACKGROUND_SPRITES = [
  { position: [-180, 88, -260] as [number, number, number], scale: 64, opacity: 0.68 },
  { position: [120, 110, -320] as [number, number, number], scale: 78, opacity: 0.72 },
  { position: [24, 132, -420] as [number, number, number], scale: 96, opacity: 0.58 },
];

export const ATMOSPHERIC_SPRITES = [
  { position: [-140, 24, -120] as [number, number, number], scale: [120, 42, 1] as [number, number, number], opacity: 0.28 },
  { position: [0, 34, -220] as [number, number, number], scale: [180, 56, 1] as [number, number, number], opacity: 0.22 },
  { position: [110, 64, -360] as [number, number, number], scale: [220, 70, 1] as [number, number, number], opacity: 0.16 },
];
