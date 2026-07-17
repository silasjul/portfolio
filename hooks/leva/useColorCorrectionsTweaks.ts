import { useEffect } from 'react';
import { useControls, folder } from 'leva';
import { IMAGES } from '@/configs/projects';
import { COLOR_CORRECTIONS_DEFAULTS, imageName } from '@/configs/colorCorrectionsConfig';
import { useLevaStore } from '@/stores/levaStore';

const schema: Record<string, ReturnType<typeof folder>> = {};
IMAGES.forEach((src, idx) => {
  const name = imageName(src);
  const d = COLOR_CORRECTIONS_DEFAULTS[idx];
  schema[name] = folder(
    {
      [`${name}_brightness`]: {
        value: d.brightness,
        min: -0.5,
        max: 0.5,
        step: 0.01,
        label: 'brightness',
      },
      [`${name}_contrast`]: {
        value: d.contrast,
        min: -1,
        max: 1,
        step: 0.01,
        label: 'contrast',
      },
      [`${name}_saturation`]: {
        value: d.saturation,
        min: -1,
        max: 1,
        step: 0.01,
        label: 'saturation',
      },
      [`${name}_hue`]: {
        value: d.hue,
        min: -180,
        max: 180,
        step: 1,
        label: 'hue',
      },
    },
    { collapsed: true },
  );
});

export function useColorCorrectionsTweaks() {
  const setConfig = useLevaStore((s) => s.setColorCorrections);

  const values = useControls('Color Corrections', schema, { collapsed: true }) as unknown as Record<
    string,
    number
  >;

  useEffect(() => {
    setConfig(
      IMAGES.map((src) => {
        const name = imageName(src);
        return {
          brightness: values[`${name}_brightness`],
          contrast: values[`${name}_contrast`],
          saturation: values[`${name}_saturation`],
          hue: values[`${name}_hue`],
        };
      }),
    );
  }, [setConfig, values]);
}
