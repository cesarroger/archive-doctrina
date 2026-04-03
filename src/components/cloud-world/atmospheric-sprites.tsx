"use client";

import { ATMOSPHERIC_SPRITES } from "@/components/cloud-world/cloud-world-config";

/**
 * Adds large, subtle haze planes to soften depth transitions across the sky.
 */
export function AtmosphericSprites() {
  return (
    <group>
      {ATMOSPHERIC_SPRITES.map((sprite, index) => (
        <mesh key={index} position={sprite.position} scale={sprite.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#f8fdff" transparent opacity={sprite.opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
