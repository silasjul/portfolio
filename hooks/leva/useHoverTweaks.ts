import { useEffect } from 'react';
import { useControls } from 'leva';
import { HOVER_DEFAULTS } from '@/configs/hoverConfig';
import { useLevaStore } from '@/stores/levaStore';

export function useHoverTweaks() {
  const setConfig = useLevaStore((s) => s.setHover);
  const d = HOVER_DEFAULTS;

  const cfg = useControls(
    'Hover',
    {
      imageZoom: { value: d.imageZoom, min: 0, max: 0.5, step: 0.01, label: 'image zoom' },
      refraction: { value: d.refraction, min: 0, max: 1, step: 0.01 },
      zRadius: { value: d.zRadius, min: 1, max: 100, step: 1 },
      durationIn: { value: d.durationIn, min: 0, max: 2, step: 0.05, label: 'ease in' },
      durationOut: { value: d.durationOut, min: 0, max: 2, step: 0.05, label: 'ease out' },
    },
    { collapsed: true },
  );

  useEffect(() => {
    setConfig(cfg);
  }, [setConfig, cfg]);
}
