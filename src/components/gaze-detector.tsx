"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";

type GazeDetectorProps = {
  targetsRef: MutableRefObject<Map<string, THREE.Object3D>>;
  dwellDuration?: number;
  onGazeChange: (projectId: string | null, progress: number, activated: boolean) => void;
};

export function GazeDetector({
  targetsRef,
  dwellDuration = 2,
  onGazeChange,
}: GazeDetectorProps) {
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const focusedId = useRef<string | null>(null);
  const dwell = useRef(0);

  useFrame((_, delta) => {
    const targets = [...targetsRef.current.values()];

    if (!targets.length) {
      onGazeChange(null, 0, false);
      return;
    }

    camera.getWorldDirection(direction);
    raycaster.set(camera.position, direction.normalize());

    const hit = raycaster.intersectObjects(targets, false)[0];
    const nextId = hit?.object.userData.projectId ?? null;

    if (!nextId) {
      focusedId.current = null;
      dwell.current = 0;
      onGazeChange(null, 0, false);
      return;
    }

    if (focusedId.current !== nextId) {
      focusedId.current = nextId;
      dwell.current = 0;
    }

    dwell.current = Math.min(dwell.current + delta, dwellDuration);
    const progress = Math.min(dwell.current / dwellDuration, 1);
    onGazeChange(nextId, progress, progress >= 1);
  });

  return null;
}
