export type VignetteConfig = {
  strength: number
  start: number
  softness: number
  squareness: number
  color: string
}

export const VIGNETTE_DEFAULTS: VignetteConfig = {
  strength: 1,
  start: 0.73,
  softness: 0.46,
  squareness: 12,
  color: '#000000',
}
