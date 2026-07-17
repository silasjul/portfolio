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
  imageSize: 0.9,
  gap: 0.5,
  smoothing: 0.25,
  friction: 0.8,
  dragSpeed: 1,
  wheelSpeed: 1,
  background: '#000000',
}
