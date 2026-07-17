import { useEffect } from 'react';
import { useControls } from 'leva';
import { EDGE_BEND_DEFAULTS } from '@/configs/edgeBendConfig';
import { useLevaStore } from '@/stores/levaStore';

export function useEdgeBendTweaks() {
  const setConfig = useLevaStore((s) => s.setEdgeBend);
  const d = EDGE_BEND_DEFAULTS;

  const cfg = useControls(
    'Edge Bend',
    {
      strength: { value: d.strength, min: 0, max: 0.9, step: 0.01 },
      start: { value: d.start, min: 0, max: 1, step: 0.01 },
      curve: { value: d.curve, min: 0.5, max: 5, step: 0.05 },
      squareness: { value: d.squareness, min: 2, max: 12, step: 0.1 },
    },
    { collapsed: true },
  );

  useEffect(() => {
    setConfig(cfg);
  }, [setConfig, cfg]);
}
