"use client";

import { CLOUD_WORLD_CONFIG } from "@/components/cloud-world/cloud-world-config";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Drives a slow forward cinematic drift with gentle mouse-parallax look.
 */
export function CameraRig() {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const position = useRef(new THREE.Vector3(0, 85, 180));
  const target = useRef(new THREE.Vector3(0, 30, -40));
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    position.current.z -= CLOUD_WORLD_CONFIG.camera.driftSpeed * delta;
    position.current.y = 85 + Math.sin(state.clock.elapsedTime * 0.08) * 1.2;
    camera.position.lerp(position.current, 1 - Math.exp(-delta * 1.8));

    target.current.set(
      pointer.current.x * CLOUD_WORLD_CONFIG.camera.parallaxStrength * 34,
      30 - pointer.current.y * CLOUD_WORLD_CONFIG.camera.parallaxStrength * 18,
      camera.position.z - 60,
    );

    lookAt.lerp(target.current, 1 - Math.exp(-delta / CLOUD_WORLD_CONFIG.camera.lookDamping));
    camera.lookAt(lookAt);
  });

  return null;
}
