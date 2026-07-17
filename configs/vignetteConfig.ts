export type VignetteConfig = {
  strength: number
  start: number
  softness: number
  color: string
}

export const VIGNETTE_DEFAULTS: VignetteConfig = {
  strength: 0.85,
  start: 0.75,
  softness: 0.7,
  color: '#000000',
}
