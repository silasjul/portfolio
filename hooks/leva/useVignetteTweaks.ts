import { useEffect } from 'react';
import { useControls } from 'leva';
import { VIGNETTE_DEFAULTS } from '@/configs/vignetteConfig';
import { useLevaStore } from '@/stores/levaStore';

export function useVignetteTweaks() {
  const setConfig = useLevaStore((s) => s.setVignette);
  const d = VIGNETTE_DEFAULTS;

  const cfg = useControls(
    'Vignette',
    {
      strength: { value: d.strength, min: 0, max: 1, step: 0.01 },
      start: { value: d.start, min: 0, max: 1.5, step: 0.01 },
      softness: { value: d.softness, min: 0.05, max: 1.5, step: 0.01 },
      squareness: { value: d.squareness, min: 2, max: 12, step: 0.1 },
      color: d.color,
    },
    { collapsed: true },
  );

  useEffect(() => {
    setConfig(cfg);
  }, [setConfig, cfg]);
}
