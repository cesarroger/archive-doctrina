"use client";

import { useCloudQuality } from "@/components/cloud/CloudQualityProvider";
import { createCloudSpriteTexture } from "@/components/cloud-world/cloud-textures";
import { useMemo } from "react";

/**
 * Places distant billboard cloud sprites deep in the scene for sky depth.
 */
export function BackgroundSprites() {
  const { settings } = useCloudQuality();
  const texture = useMemo(() => createCloudSpriteTexture(), []);
  const sprites = useMemo(() => {
    const seeded = (seed: number) => {
      const value = Math.sin(seed * 78.233) * 43758.5453;
      return value - Math.floor(value);
    };

    return Array.from({ length: settings.spriteCount }, (_, index) => {
      const spread = 180 + seeded(index + 3) * 180;
      return {
        position: [
          (seeded(index + 11) - 0.5) * spread,
          58 + seeded(index + 19) * 112,
          -(110 + seeded(index + 29) * 420),
        ] as [number, number, number],
        scale: 28 + seeded(index + 41) * 82,
        opacity: 0.03 + seeded(index + 53) * 0.06,
      };
    });
  }, [settings.spriteCount]);

  return (
    <group>
      {sprites.map((sprite, index) => (
        <sprite key={index} position={sprite.position} scale={[sprite.scale, sprite.scale * 0.58, 1]}>
          <spriteMaterial
            map={texture}
            color="#ffffff"
            transparent
            opacity={sprite.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}
