"use client";

import { CLOUD_WORLD_CONFIG, CLOUD_QUALITY_PRESETS } from "@/components/cloud-world/cloud-world-config";
import { getGPUTier } from "detect-gpu";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CloudQualityContext = createContext({
  gpuTier: "medium",
  quality: "medium",
  settings: CLOUD_QUALITY_PRESETS.medium,
});

function normalizeTier(tier) {
  if (tier === "WEBGL_UNSUPPORTED" || tier === "FALLBACK") {
    return "low";
  }

  if (typeof tier === "number") {
    if (tier >= 3) return "high";
    if (tier <= 1) return "low";
    return "medium";
  }

  return "medium";
}

/**
 * Provides CloudWorld quality settings derived from GPU detection with an optional dev override.
 */
export function CloudQualityProvider({ children }) {
  const forcedQuality = CLOUD_WORLD_CONFIG.FORCE_QUALITY;
  const initialQuality = forcedQuality ?? "medium";
  const [gpuTier, setGpuTier] = useState(initialQuality);
  const [quality, setQuality] = useState(initialQuality);

  useEffect(() => {
    if (forcedQuality) {
      return;
    }

    let mounted = true;

    void getGPUTier()
      .then((result) => {
        if (!mounted) {
          return;
        }

        const nextQuality = normalizeTier(result.tier);
        setGpuTier(nextQuality);
        setQuality(nextQuality);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setGpuTier("medium");
        setQuality("medium");
      });

    return () => {
      mounted = false;
    };
  }, [forcedQuality]);

  const value = useMemo(
    () => ({
      gpuTier,
      quality,
      settings: CLOUD_QUALITY_PRESETS[quality] ?? CLOUD_QUALITY_PRESETS.medium,
    }),
    [gpuTier, quality],
  );

  return (
    <CloudQualityContext.Provider value={value}>
      {children}
    </CloudQualityContext.Provider>
  );
}

/**
 * Reads the current CloudWorld quality tier and resolved settings.
 */
export function useCloudQuality() {
  return useContext(CloudQualityContext);
}
