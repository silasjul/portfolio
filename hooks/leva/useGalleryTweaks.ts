import { useEffect } from 'react';
import { useControls } from 'leva';
import { GALLERY_DEFAULTS } from '@/configs/galleryConfig';
import { useLevaStore } from '@/stores/levaStore';

export function useGalleryTweaks() {
  const setConfig = useLevaStore((s) => s.setGallery);

  const {
    imageSize,
    gap,
    smoothing,
    friction,
    dragSpeed,
    wheelSpeed,
    background,
  } = useControls('Gallery', {
    imageSize: {
      value: GALLERY_DEFAULTS.imageSize,
      min: 0.5,
      max: 2.5,
      step: 0.05,
      label: 'image size',
    },
    gap: { value: GALLERY_DEFAULTS.gap, min: 0, max: 8, step: 0.1 },
    smoothing:{ value: GALLERY_DEFAULTS.smoothing, min: 0.02, max: 0.5, step: 0.01 },
    friction: { value: GALLERY_DEFAULTS.friction, min: 0.8, max: 0.99, step: 0.005 },
    dragSpeed: {
      value: GALLERY_DEFAULTS.dragSpeed,
      min: 0.2,
      max: 3,
      step: 0.05,
      label: 'drag speed',
    },
    wheelSpeed: {
      value: GALLERY_DEFAULTS.wheelSpeed,
      min: 0.2,
      max: 3,
      step: 0.05,
      label: 'scroll speed',
    },
    background: GALLERY_DEFAULTS.background,
  }, {collapsed: true});

  useEffect(() => {
    setConfig({
      imageSize,
      gap,
      smoothing,
      friction,
      dragSpeed,
      wheelSpeed,
      background,
    });
  }, [setConfig, imageSize, gap, smoothing, friction, dragSpeed, wheelSpeed, background]);
}
