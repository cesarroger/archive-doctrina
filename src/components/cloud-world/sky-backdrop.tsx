"use client";

import { CLOUD_WORLD_CONFIG } from "@/components/cloud-world/cloud-world-config";
import * as THREE from "three";

/**
 * Sets the scene background and fog for the open sky atmosphere.
 */
export function SkyBackdrop() {
  return (
    <>
      <mesh renderOrder={-1}>
        <sphereGeometry args={[850, 32, 32]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={{}}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            void main() {
              vec3 topColor    = vec3(0.059, 0.165, 0.361);
              vec3 midColor    = vec3(0.102, 0.361, 0.620);
              vec3 horizColor  = vec3(0.659, 0.812, 0.910);
              float t = vUv.y;
              vec3 col = t > 0.5
                ? mix(midColor, topColor, (t - 0.5) * 2.0)
                : mix(horizColor, midColor, t * 2.0);
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>
      <fog
        attach="fog"
        args={[
          CLOUD_WORLD_CONFIG.fog.color,
          CLOUD_WORLD_CONFIG.fog.near,
          CLOUD_WORLD_CONFIG.fog.far,
        ]}
      />
    </>
  );
}
