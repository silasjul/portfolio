export type HoverConfig = {
  /** How far the image zooms in while the card size stays fixed (0 = none) */
  imageZoom: number
  /** Refraction the glass eases toward on hover */
  refraction: number
  /** Z-radius (bevel depth) the glass eases toward on hover */
  zRadius: number
  /** Tween duration when the pointer enters, seconds */
  durationIn: number
  /** Tween duration when the pointer leaves, seconds */
  durationOut: number
}

export const HOVER_DEFAULTS: HoverConfig = {
  imageZoom: 0,
  refraction: 0,
  zRadius: 0,
  durationIn: 0.3,
  durationOut: 0.55,
}
