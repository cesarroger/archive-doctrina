"use client";

import { useCloudQuality } from "@/components/cloud/CloudQualityProvider";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";

/**
 * Scene post processing that scales by the resolved cloud quality tier.
 */
export function CloudPostFX() {
  const { settings } = useCloudQuality();

  if (!settings.bloom && !settings.depthOfField) {
    return null;
  }

  if (settings.bloom && settings.depthOfField) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.18} luminanceThreshold={0.82} luminanceSmoothing={0.9} />
        <DepthOfField
          focusDistance={0.018}
          focalLength={0.02}
          bokehScale={1.6}
          height={480}
        />
      </EffectComposer>
    );
  }

  if (settings.bloom) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.18} luminanceThreshold={0.82} luminanceSmoothing={0.9} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField
        focusDistance={0.018}
        focalLength={0.02}
        bokehScale={1.6}
        height={480}
      />
    </EffectComposer>
  );
}
