"use client";

import type { Project } from "@/data/projects";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type FloatingFrameProps = {
  project: Project;
  active: boolean;
  gazed: boolean;
  gazeProgress: number;
  onRegister: (projectId: string, mesh: THREE.Mesh | null) => void;
  onSelect: (projectId: string) => void;
  onOpen: (slug: string) => void;
};

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";

  words.forEach((word) => {
    const testLine = `${line}${word} `;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line.trim(), x, y);
      line = `${word} `;
      y += lineHeight;
      return;
    }

    line = testLine;
  });

  if (line) {
    context.fillText(line.trim(), x, y);
  }
}

function createPosterTexture(project: Project) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1280;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, project.posterAccent);
  gradient.addColorStop(0.45, "#ffffff");
  gradient.addColorStop(1, project.frameTone);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(18, 17, 15, 0.12)";
  context.lineWidth = 2;
  context.strokeRect(64, 64, canvas.width - 128, canvas.height - 128);

  context.fillStyle = "rgba(18, 17, 15, 0.5)";
  context.font = "500 28px Manrope, sans-serif";
  context.fillText(project.category.toUpperCase(), 100, 148);

  context.fillStyle = "#12110f";
  context.font = "600 112px Cormorant Garamond, serif";
  project.title.split(" ").forEach((line, index) => {
    context.fillText(line, 100, 430 + index * 102);
  });

  context.fillStyle = "rgba(18, 17, 15, 0.65)";
  context.font = "400 34px Manrope, sans-serif";
  wrapText(context, project.tagline, 100, 840, 760, 50);

  context.fillStyle = "rgba(18, 17, 15, 0.42)";
  context.fillText(`${project.year} / ${project.location}`, 100, 1130);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createVideoTexture(url: string) {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";
  video.src = url;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return { video, texture };
}

export function FloatingFrame({
  project,
  active,
  gazed,
  gazeProgress,
  onRegister,
  onSelect,
  onOpen,
}: FloatingFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef<THREE.Mesh>(null);
  const posterMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const videoMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const posterTexture = useMemo(() => createPosterTexture(project), [project]);
  const videoAsset = useMemo(() => createVideoTexture(project.videoUrl), [project.videoUrl]);

  useEffect(() => {
    onRegister(project.id, contentRef.current);
    return () => onRegister(project.id, null);
  }, [onRegister, project.id]);

  useEffect(() => {
    if (active) {
      const attemptPlayback = () => {
        void videoAsset.video.play().catch(() => undefined);
      };

      if (videoAsset.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        attemptPlayback();
      } else {
        videoAsset.video.addEventListener("canplay", attemptPlayback, { once: true });
        videoAsset.video.load();
      }

      return;
    }

    videoAsset.video.pause();
  }, [active, videoAsset.video]);

  useEffect(() => {
    return () => {
      posterTexture?.dispose();
      videoAsset.texture.dispose();
      videoAsset.video.pause();
      videoAsset.video.src = "";
      videoAsset.video.load();
    };
  }, [posterTexture, videoAsset.texture, videoAsset.video]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const frame = frameRef.current;
    const glow = glowRef.current;
    const progress = progressRef.current;
    const posterMaterial = posterMaterialRef.current;
    const videoMaterial = videoMaterialRef.current;

    if (!group || !frame || !glow || !progress || !posterMaterial || !videoMaterial) {
      return;
    }

    const t = state.clock.getElapsedTime();
    group.position.y = project.position[1] + Math.sin(t * 0.08 + project.position[0]) * 0.1;
    group.rotation.z = Math.sin(t * 0.035 + project.position[2]) * 0.0015;

    const attention = active ? 1 : gazed ? gazeProgress : 0;
    const intensity = 0.42 + attention * 0.48;
    const targetScale = 1 + attention * 0.038;
    const eased = 1 - Math.exp(-delta * 2.2);
    group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), eased);

    const frameMaterial = frame.material as THREE.MeshPhysicalMaterial;
    frameMaterial.emissiveIntensity = THREE.MathUtils.lerp(
      frameMaterial.emissiveIntensity,
      0.04 + intensity * 0.16,
      1 - Math.exp(-delta * 4),
    );
    frameMaterial.clearcoat = THREE.MathUtils.lerp(
      frameMaterial.clearcoat,
      1 + attention * 0.16,
      1 - Math.exp(-delta * 4),
    );
    frameMaterial.clearcoatRoughness = THREE.MathUtils.lerp(
      frameMaterial.clearcoatRoughness,
      0.12 - attention * 0.03,
      1 - Math.exp(-delta * 4),
    );

    const glowMaterial = glow.material as THREE.MeshBasicMaterial;
    glowMaterial.opacity = THREE.MathUtils.lerp(
      glowMaterial.opacity,
      0.014 + attention * 0.14,
      1 - Math.exp(-delta * 4),
    );

    progress.visible = gazed || active;
    progress.scale.x = THREE.MathUtils.lerp(
      progress.scale.x,
      Math.max(gazeProgress, active ? 1 : 0.001),
      1 - Math.exp(-delta * 7),
    );

    posterMaterial.opacity = THREE.MathUtils.lerp(
      posterMaterial.opacity,
      active ? 0 : 1 - attention * 0.08,
      1 - Math.exp(-delta * 5),
    );
    videoMaterial.opacity = THREE.MathUtils.lerp(
      videoMaterial.opacity,
      active ? 1 : attention * 0.08,
      1 - Math.exp(-delta * 3.8),
    );
  });

  return (
    <group position={project.position} rotation={[0, project.rotationY, 0]} ref={groupRef}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[9.3, 11.9]} />
        <meshPhysicalMaterial color={project.frameTone} roughness={0.46} metalness={0.02} />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, -0.04]}>
        <planeGeometry args={[11.1, 14]} />
        <meshBasicMaterial color={new THREE.Color(project.accent)} transparent opacity={0.08} />
      </mesh>

      <mesh ref={frameRef} castShadow receiveShadow>
        <boxGeometry args={[8.6, 10.9, 0.38]} />
        <meshPhysicalMaterial
          color="#f8fbff"
          roughness={0.18}
          metalness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.12}
          emissive={new THREE.Color(project.accent)}
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[7.02, 9.42, 0.18]} />
        <meshPhysicalMaterial color="#fbfdff" roughness={0.1} metalness={0.02} />
      </mesh>

      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[7.58, 9.88, 0.08]} />
        <meshPhysicalMaterial
          color="#eef7ff"
          roughness={0.42}
          metalness={0.02}
          transparent
          opacity={0.55}
        />
      </mesh>

      <mesh
        ref={contentRef}
        position={[0, 0, 0.26]}
        renderOrder={3}
        onClick={() => (active ? onOpen(project.slug) : onSelect(project.id))}
      >
        <planeGeometry args={[6.58, 9.02]} />
        <meshBasicMaterial
          ref={posterMaterialRef}
          map={posterTexture}
          toneMapped={false}
          transparent
          depthWrite={false}
          depthTest={false}
          polygonOffset
          polygonOffsetFactor={-2}
          opacity={1}
        />
      </mesh>

      <mesh position={[0, 0, 0.285]} renderOrder={4}>
        <planeGeometry args={[6.58, 9.02]} />
        <meshBasicMaterial
          ref={videoMaterialRef}
          map={videoAsset.texture}
          toneMapped={false}
          transparent
          depthWrite={false}
          depthTest={false}
          polygonOffset
          polygonOffsetFactor={-4}
          opacity={0}
        />
      </mesh>

      <mesh ref={progressRef} position={[0, -5.25, 0.34]} renderOrder={5} visible={false}>
        <planeGeometry args={[5.8, 0.05]} />
        <meshBasicMaterial color="#143250" transparent depthWrite={false} depthTest={false} opacity={0.22} />
      </mesh>
    </group>
  );
}
