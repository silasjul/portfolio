export type GalleryConfig = {
  imageSize: number
  gap: number
  smoothing: number
  friction: number
  dragSpeed: number
  wheelSpeed: number
  background: string
}

export const GALLERY_DEFAULTS: GalleryConfig = {
  imageSize: 1,
  gap: 0.8,
  smoothing: 0.25,
  friction: 0.85,
  dragSpeed: 1,
  wheelSpeed: 1,
  background: '#000000',
}
