"use client";

import { useCloudQuality } from "@/components/cloud/CloudQualityProvider";
import { CLOUD_CLUSTER_LAYOUT } from "@/components/cloud-world/cloud-world-config";

/**
 * Builds the lower cloud mass so the camera feels suspended above a cloud field.
 */
export function CloudFloor() {
  const { settings } = useCloudQuality();

  return (
    <group>
      {CLOUD_CLUSTER_LAYOUT.map((cluster, index) => (
        <group key={index} position={cluster.position}>
          <mesh scale={[cluster.scale * 2.4, cluster.scale * 0.7, cluster.scale * 1.4]}>
            <sphereGeometry args={[1, settings.floorSegments, settings.floorSegments]} />
            <meshStandardMaterial color="#f6fbff" roughness={0.96} transparent opacity={0.96} />
          </mesh>
          <mesh position={[cluster.scale * 0.4, 3, -cluster.scale * 0.2]} scale={[cluster.scale * 1.8, cluster.scale * 0.55, cluster.scale * 1.1]}>
            <sphereGeometry
              args={[
                1,
                Math.max(Math.round(settings.floorSegments * 0.78), 16),
                Math.max(Math.round(settings.floorSegments * 0.78), 16),
              ]}
            />
            <meshStandardMaterial color="#eef7ff" roughness={0.98} transparent opacity={0.84} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
