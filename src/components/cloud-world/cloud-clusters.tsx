"use client";

/**
 * Adds mid-distance cloud masses to create exploration depth around the hero tower.
 */
export function CloudClusters() {
  const clusters = [
    { position: [-92, 18, -180] as [number, number, number], scale: [18, 8, 14] as [number, number, number] },
    { position: [102, 22, -200] as [number, number, number], scale: [22, 10, 16] as [number, number, number] },
    { position: [-48, 42, -262] as [number, number, number], scale: [16, 7, 12] as [number, number, number] },
    { position: [62, 54, -310] as [number, number, number], scale: [20, 9, 14] as [number, number, number] },
  ];

  return (
    <group>
      {clusters.map((cluster, index) => (
        <group key={index} position={cluster.position}>
          <mesh scale={cluster.scale}>
            <sphereGeometry args={[1, 22, 22]} />
            <meshStandardMaterial color="#f5fbff" roughness={0.97} transparent opacity={0.9} />
          </mesh>
          <mesh position={[cluster.scale[0] * 0.3, 3, 0]} scale={[cluster.scale[0] * 0.7, cluster.scale[1] * 0.7, cluster.scale[2] * 0.8]}>
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial color="#edf7ff" roughness={0.98} transparent opacity={0.74} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
