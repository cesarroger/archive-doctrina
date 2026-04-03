"use client";

import { FloatingFrame } from "@/components/floating-frame";
import { GazeDetector } from "@/components/gaze-detector";
import type { Project } from "@/data/projects";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type VoidSceneProps = {
  projects: Project[];
  activeProjectId: string | null;
  gazeProjectId: string | null;
  gazeProgress: number;
  onFrameActivate: (projectId: string) => void;
  onOpenProject: (slug: string) => void;
  onGazeChange: (projectId: string | null, progress: number, activated: boolean) => void;
};

type PortalAuraProps = {
  projects: Project[];
  gazeProjectId: string | null;
  gazeProgress: number;
  activeProjectId: string | null;
};

function AtmosphereParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 72;
  const data = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const seeded = (seed: number) => {
      const value = Math.sin(seed * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };

    for (let index = 0; index < particleCount; index += 1) {
      const i3 = index * 3;
      positions[i3] = (seeded(index + 1) - 0.5) * 180;
      positions[i3 + 1] = seeded(index + 11) * 70 - 10;
      positions[i3 + 2] = -seeded(index + 21) * 220 + 30;
      sizes[index] = 0.45 + seeded(index + 31) * 1.25;
    }

    return { positions, sizes };
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) {
      return;
    }

    const positions = points.geometry.attributes.position.array as Float32Array;
    const elapsed = state.clock.getElapsedTime();

    for (let index = 0; index < particleCount; index += 1) {
      const i3 = index * 3;
      positions[i3] += Math.sin(elapsed * 0.035 + index * 1.37) * 0.0009;
      positions[i3 + 1] += Math.cos(elapsed * 0.04 + index * 0.91) * 0.0006;

      if (positions[i3] > 90) positions[i3] = -90;
      if (positions[i3] < -90) positions[i3] = 90;
      if (positions[i3 + 1] > 62) positions[i3 + 1] = -8;
      if (positions[i3 + 1] < -8) positions[i3 + 1] = 62;
    }

    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
          count={data.positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[data.sizes, 1]}
          count={data.sizes.length}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f8fdff"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const keysRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const pointerRef = useRef({ x: 0, y: 0 });
  const velocity = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3(0, 8.4, 24));
  const targetPosition = useRef(new THREE.Vector3(0, 8.4, 24));
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const worldUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const forward = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const input = useMemo(() => new THREE.Vector3(), []);
  const driftOffset = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    let lastX = window.innerWidth * 0.5;
    let lastY = window.innerHeight * 0.5;

    const onPointerMove = (event: PointerEvent) => {
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      targetYaw.current = THREE.MathUtils.clamp(
        targetYaw.current + deltaX * 0.0026,
        -0.82,
        0.82,
      );
      targetPitch.current = THREE.MathUtils.clamp(
        targetPitch.current - deltaY * 0.0015,
        -0.32,
        0.24,
      );

      pointerRef.current = {
        x: targetYaw.current,
        y: targetPitch.current,
      };
    };

    const setKeyState = (event: KeyboardEvent, pressed: boolean) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          keysRef.current.forward = pressed;
          break;
        case "s":
        case "arrowdown":
          keysRef.current.backward = pressed;
          break;
        case "a":
        case "arrowleft":
          keysRef.current.left = pressed;
          break;
        case "d":
        case "arrowright":
          keysRef.current.right = pressed;
          break;
        default:
          break;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => setKeyState(event, true);
    const handleKeyUp = (event: KeyboardEvent) => setKeyState(event, false);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    yaw.current = THREE.MathUtils.lerp(
      yaw.current,
      pointerRef.current.x,
      1 - Math.exp(-delta * 3.4),
    );
    pitch.current = THREE.MathUtils.lerp(
      pitch.current,
      pointerRef.current.y,
      1 - Math.exp(-delta * 3.1),
    );

    forward.set(Math.sin(yaw.current), 0, -Math.cos(yaw.current)).normalize();
    right.set(-forward.z, 0, forward.x).normalize();
    input.set(0, 0, 0);

    if (keysRef.current.forward) {
      input.add(forward);
    }
    if (keysRef.current.backward) {
      input.sub(forward);
    }
    if (keysRef.current.left) {
      input.sub(right);
    }
    if (keysRef.current.right) {
      input.add(right);
    }

    if (input.lengthSq() > 0) {
      const moveScale =
        keysRef.current.left || keysRef.current.right
          ? 2.2
          : keysRef.current.forward || keysRef.current.backward
            ? 4.6
            : 0;
      input.normalize().multiplyScalar(moveScale);
      velocity.current.lerp(input, 1 - Math.exp(-delta * 2.5));
    } else {
      velocity.current.lerp(new THREE.Vector3(), 1 - Math.exp(-delta * 3.4));
    }

    targetPosition.current.addScaledVector(velocity.current, delta);
    targetPosition.current.x = THREE.MathUtils.clamp(targetPosition.current.x, -46, 46);
    targetPosition.current.z = THREE.MathUtils.clamp(targetPosition.current.z, -102, 34);
    driftOffset.set(
      Math.sin(state.clock.elapsedTime * 0.12) * 0.03,
      Math.cos(state.clock.elapsedTime * 0.16) * 0.018,
      0,
    );
    targetPosition.current.y = 8.9 + driftOffset.y;

    currentPosition.current.lerp(targetPosition.current, 1 - Math.exp(-delta * 1.9));
    camera.position.set(
      currentPosition.current.x + driftOffset.x,
      currentPosition.current.y,
      currentPosition.current.z,
    );

    desiredLook.set(
      camera.position.x + forward.x * 24,
      camera.position.y + pitch.current * 9,
      camera.position.z + forward.z * 24,
    );
    lookTarget.lerp(desiredLook, 1 - Math.exp(-delta * 2.2));
    camera.lookAt(lookTarget);
    camera.up.copy(worldUp);
  });

  return null;
}

function SceneAtmosphere() {
  const hazeBands = [
    {
      position: [0, -10, -72] as [number, number, number],
      scale: [260, 94, 1] as [number, number, number],
      opacity: 0.085,
      color: "#f4fbff",
    },
    {
      position: [0, 16, -132] as [number, number, number],
      scale: [280, 104, 1] as [number, number, number],
      opacity: 0.045,
      color: "#edf8ff",
    },
    {
      position: [0, -18, -180] as [number, number, number],
      scale: [320, 120, 1] as [number, number, number],
      opacity: 0.05,
      color: "#fbfeff",
    },
  ];
  const cloudSpecs = [
    { position: [-56, 30, -110] as [number, number, number], scale: [22, 6.8, 1] as [number, number, number], opacity: 0.03 },
    { position: [48, 38, -142] as [number, number, number], scale: [28, 8.2, 1] as [number, number, number], opacity: 0.022 },
    { position: [6, 54, -198] as [number, number, number], scale: [42, 11.8, 1] as [number, number, number], opacity: 0.016 },
    { position: [-22, 18, -70] as [number, number, number], scale: [13, 3.8, 1] as [number, number, number], opacity: 0.02 },
  ];

  return (
    <>
      <color attach="background" args={["#89d1ff"]} />
      <fog attach="fog" args={["#edf8ff", 58, 240]} />
      <ambientLight intensity={1.1} color="#f7fdff" />
      <hemisphereLight intensity={1.12} color="#d9f2ff" groundColor="#f8fdff" />
      <directionalLight position={[28, 38, 20]} intensity={1.34} color="#f9fdff" />
      <spotLight
        position={[-20, 24, 16]}
        intensity={0.1}
        angle={1.05}
        penumbra={1}
        distance={220}
        color="#ffffff"
      />
      <pointLight position={[0, 36, -100]} intensity={0.18} distance={220} color="#effbff" />
      <mesh position={[0, -30, -240]} scale={[420, 180, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#fbfeff" transparent opacity={0.11} depthWrite={false} />
      </mesh>
      {hazeBands.map((band, index) => (
        <mesh key={index} position={band.position} scale={band.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={band.color}
            transparent
            opacity={band.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
      {cloudSpecs.map((cloud, index) => (
        <mesh
          key={index}
          position={cloud.position}
          rotation={[0, 0, index % 2 === 0 ? 0.05 : -0.04]}
          scale={cloud.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={cloud.opacity} depthWrite={false} />
        </mesh>
      ))}
      <AtmosphereParticles />
    </>
  );
}

function PortalAura({ projects, gazeProjectId, gazeProgress, activeProjectId }: PortalAuraProps) {
  const auraRef = useRef<THREE.PointLight>(null);
  const auraTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const light = auraRef.current;
    if (!light) {
      return;
    }

    const focusedId = activeProjectId ?? gazeProjectId;
    const focusedProject = projects.find((project) => project.id === focusedId) ?? null;

    if (!focusedProject) {
      light.intensity = THREE.MathUtils.lerp(light.intensity, 0, 1 - Math.exp(-delta * 4));
      return;
    }

    auraTarget.set(
      focusedProject.position[0],
      focusedProject.position[1] + 0.8,
      focusedProject.position[2] + 2.6,
    );
    light.position.lerp(auraTarget, 1 - Math.exp(-delta * 2.2));
    const targetIntensity = activeProjectId === focusedProject.id ? 0.32 : gazeProgress * 0.16;
    light.intensity = THREE.MathUtils.lerp(
      light.intensity,
      targetIntensity,
      1 - Math.exp(-delta * 3.8),
    );
  });

  return (
    <pointLight
      ref={auraRef}
      intensity={0}
      distance={34}
      decay={2}
      color="#eef8ff"
      position={[0, 12, -30]}
    />
  );
}

function SceneContents({
  projects,
  activeProjectId,
  gazeProjectId,
  gazeProgress,
  onFrameActivate,
  onOpenProject,
  onGazeChange,
}: VoidSceneProps) {
  const targetsRef = useRef(new Map<string, THREE.Object3D>());

  const handleRegister = useCallback((projectId: string, mesh: THREE.Mesh | null) => {
    if (mesh) {
      mesh.userData.projectId = projectId;
      targetsRef.current.set(projectId, mesh);
      return;
    }

    targetsRef.current.delete(projectId);
  }, []);

  return (
    <>
      <SceneAtmosphere />
      <PortalAura
        projects={projects}
        gazeProjectId={gazeProjectId}
        gazeProgress={gazeProgress}
        activeProjectId={activeProjectId}
      />
      <CameraRig />
      {projects.map((project) => (
        <FloatingFrame
          key={project.id}
          project={project}
          active={project.id === activeProjectId}
          gazed={project.id === gazeProjectId}
          gazeProgress={project.id === gazeProjectId ? gazeProgress : 0}
          onRegister={handleRegister}
          onSelect={onFrameActivate}
          onOpen={onOpenProject}
        />
      ))}
      <GazeDetector targetsRef={targetsRef} onGazeChange={onGazeChange} />
    </>
  );
}

export function VoidScene(props: VoidSceneProps) {
  return (
    <div className="void-sheen absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 8.9, 24], fov: 28, near: 0.1, far: 360 }}
      >
        <SceneContents {...props} />
      </Canvas>
    </div>
  );
}
