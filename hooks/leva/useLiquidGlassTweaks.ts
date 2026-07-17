import { useEffect } from 'react';
import { useControls } from 'leva';
import { LIQUID_GLASS_DEFAULTS } from '@/configs/liquidGlassConfig';
import { useLevaStore } from '@/stores/levaStore';

export function useLiquidGlassTweaks() {
  const setConfig = useLevaStore((s) => s.setLiquidGlass);
  const d = LIQUID_GLASS_DEFAULTS;

  const cfg = useControls(
    'Liquid Glass',
    {
      blurAmount: { value: d.blurAmount, min: 0, max: 1, step: 0.01 },
      refraction: { value: d.refraction, min: 0, max: 1, step: 0.01 },
      chromAberration: { value: d.chromAberration, min: 0, max: 1, step: 0.01 },
      edgeHighlight: { value: d.edgeHighlight, min: 0, max: 1, step: 0.01 },
      specular: { value: d.specular, min: 0, max: 1, step: 0.01 },
      fresnel: { value: d.fresnel, min: 0, max: 1, step: 0.01 },
      distortion: { value: d.distortion, min: 0, max: 1, step: 0.01 },
      cornerRadius: { value: d.cornerRadius, min: 0, max: 120, step: 1 },
      zRadius: { value: d.zRadius, min: 1, max: 100, step: 1 },
      opacity: { value: d.opacity, min: 0, max: 1, step: 0.01 },
      saturation: { value: d.saturation, min: -1, max: 1, step: 0.01 },
      tintStrength: { value: d.tintStrength, min: 0, max: 1, step: 0.01 },
      brightness: { value: d.brightness, min: -0.5, max: 0.5, step: 0.01 },
      shadowOpacity: { value: d.shadowOpacity, min: 0, max: 1, step: 0.01 },
      shadowSpread: { value: d.shadowSpread, min: 0, max: 40, step: 1 },
      shadowOffsetY: { value: d.shadowOffsetY, min: -20, max: 20, step: 1 },
      bevelMode: { value: d.bevelMode, options: { 'biconvex pill': 0, dome: 1 } },
      referenceWidth: {
        value: d.referenceWidth,
        min: 80,
        max: 1000,
        step: 10,
        label: 'reference width',
      },
    },
    { collapsed: true },
  );

  useEffect(() => {
    setConfig(cfg);
  }, [setConfig, cfg]);
}
