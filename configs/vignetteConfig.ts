export type VignetteConfig = {
  strength: number
  start: number
  softness: number
  squareness: number
  color: string
}

export const VIGNETTE_DEFAULTS: VignetteConfig = {
  strength: 0.85,
  start: 0.46,
  softness: 0.7,
  squareness: 5,
  color: '#000000',
}
