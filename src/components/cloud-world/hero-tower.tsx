"use client";

/**
 * Creates the central cumulonimbus tower using stacked cloud spheres.
 */
export function HeroTower() {
  const seed = (n: number) => {
    const v = Math.sin(n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };

  const layers = Array.from({ length: 22 }, (_, i) => {
    const y =
      i <= 11
        ? seed(i * 3.1) * 60
        : i <= 18
          ? 60 + seed(i * 2.7) * 70
          : 130 + seed(i * 4.3) * 50;

    const radius =
      i <= 11
        ? 12 + seed(i * 1.7) * 10
        : i <= 18
          ? 8 + seed(i * 2.1) * 8
          : 6 + seed(i * 3.3) * 6;

    return {
      position: [
        (seed(i * 5.3) - 0.5) * 40,
        y - 5,
        (seed(i * 7.1) - 0.5) * 30 - 120,
      ] as [number, number, number],
      scale: [radius, radius, radius] as [number, number, number],
      emissive: y < 50,
    };
  });

  return (
    <group>
      {layers.map((layer, index) => (
        <mesh key={index} position={layer.position} scale={layer.scale}>
          <sphereGeometry args={[1, 22, 22]} />
          <meshStandardMaterial
            color="#f5f2ec"
            roughness={0.95}
            metalness={0}
            transparent
            opacity={0.92}
            emissive={layer.emissive ? "#1a0800" : "#000000"}
            emissiveIntensity={layer.emissive ? 0.07 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}
