"use client";

import { CloudQualityProvider } from "@/components/cloud/CloudQualityProvider";
import { AtmosphericSprites } from "@/components/cloud-world/atmospheric-sprites";
import { BackgroundSprites } from "@/components/cloud-world/background-sprites";
import { CameraRig } from "@/components/cloud-world/camera-rig";
import { CloudClusters } from "@/components/cloud-world/cloud-clusters";
import { CloudFloor } from "@/components/cloud-world/cloud-floor";
import { CLOUD_WORLD_CONFIG } from "@/components/cloud-world/cloud-world-config";
import { CloudPostFX } from "@/components/cloud-world/cloud-post-fx";
import { HeroTower } from "@/components/cloud-world/hero-tower";
import { InteractiveLayer } from "@/components/cloud-world/interactive-layer";
import { SkyBackdrop } from "@/components/cloud-world/sky-backdrop";
import { Canvas } from "@react-three/fiber";

/**
 * Main Phase 1 landing scene composition for the Archive Doctrina cloud world.
 */
export function CloudWorld() {
  return (
    <CloudQualityProvider>
      <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
        camera={{
          position: [0, 85, 180],
          fov: CLOUD_WORLD_CONFIG.camera.fov,
          near: CLOUD_WORLD_CONFIG.camera.near,
          far: CLOUD_WORLD_CONFIG.camera.far,
          }}
        >
          <SkyBackdrop />
          <ambientLight intensity={CLOUD_WORLD_CONFIG.lights.ambient} color="#f7fcff" />
          <hemisphereLight
            intensity={CLOUD_WORLD_CONFIG.lights.hemisphere}
            color="#e0f3ff"
            groundColor="#f6fbff"
          />
        <directionalLight
          intensity={CLOUD_WORLD_CONFIG.lights.directional}
          color="#fff6e8"
          position={[-180, 320, 80]}
        />
        <directionalLight intensity={0.18} color="#ddeeff" position={[100, -40, 200]} />
        <CameraRig />
          <AtmosphericSprites />
          <BackgroundSprites />
          <CloudFloor />
          <CloudClusters />
          <HeroTower />
          <InteractiveLayer />
          <CloudPostFX />
        </Canvas>
      </div>
    </CloudQualityProvider>
  );
}
