import { IMAGES } from './projects'

export type ColorCorrection = {
  brightness: number
  contrast: number
  saturation: number
  hue: number
}

/** One entry per image, same order as IMAGES. */
export type ColorCorrectionsConfig = ColorCorrection[]

export const COLOR_CORRECTION_DEFAULT: ColorCorrection = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
}

export const imageName = (src: string) => src.replace(/^\//, '').replace(/\.[^.]+$/, '')

const BAKED: Record<string, Partial<ColorCorrection>> = {
  wind: { brightness: -0.02, contrast: -0.05, saturation: 0.24 },
  'xr-drumming-game': { brightness: 0.22, contrast: 0.17, saturation: 0.33 },
  'SDF-painting': { brightness: 0.09, saturation: 0.21 },
  steve: { brightness: -0.12, contrast: 0.05, saturation: 0.28 },
}

export const COLOR_CORRECTIONS_DEFAULTS: ColorCorrectionsConfig = IMAGES.map((src) => ({
  ...COLOR_CORRECTION_DEFAULT,
  ...BAKED[imageName(src)],
}))
