"use client";

import { CLOUD_WORLD_CONFIG } from "@/components/cloud-world/cloud-world-config";

/**
 * Exposes anchor positions for future Phase 2 logo and portal objects.
 */
export function InteractiveLayer() {
  return (
    <group>
      <group name="logo-anchor" position={CLOUD_WORLD_CONFIG.anchors.logo.toArray()} visible={false} />
      <group
        name="portal-anchor"
        position={CLOUD_WORLD_CONFIG.anchors.portal.toArray()}
        visible={false}
      />
    </group>
  );
}
