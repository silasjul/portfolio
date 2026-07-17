import { useEffect } from 'react';
import { useControls } from 'leva';
import { MOTION_DEFAULTS } from '@/configs/motionConfig';
import { useLevaStore } from '@/stores/levaStore';

export function useMotionTweaks() {
  const setConfig = useLevaStore((s) => s.setMotion);
  const d = MOTION_DEFAULTS;

  const cfg = useControls(
    'Motion',
    {
      zoomOut: { value: d.zoomOut, min: 0, max: 0.5, step: 0.01, label: 'zoom out' },
      zoomEaseOut: {
        value: d.zoomEaseOut,
        min: 0.01,
        max: 0.4,
        step: 0.005,
        label: 'ease out',
      },
      zoomEaseIn: {
        value: d.zoomEaseIn,
        min: 0.01,
        max: 0.4,
        step: 0.005,
        label: 'ease back in',
      },
    },
    { collapsed: true },
  );

  useEffect(() => {
    setConfig(cfg);
  }, [setConfig, cfg]);
}
