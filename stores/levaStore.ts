import { create } from 'zustand';
import { GALLERY_DEFAULTS, type GalleryConfig } from '@/configs/galleryConfig';
import { LIQUID_GLASS_DEFAULTS, type LiquidGlassConfig } from '@/configs/liquidGlassConfig';
import {
  COLOR_CORRECTIONS_DEFAULTS,
  type ColorCorrectionsConfig,
} from '@/configs/colorCorrectionsConfig';
import { EDGE_BEND_DEFAULTS, type EdgeBendConfig } from '@/configs/edgeBendConfig';
import { VIGNETTE_DEFAULTS, type VignetteConfig } from '@/configs/vignetteConfig';
import { MOTION_DEFAULTS, type MotionConfig } from '@/configs/motionConfig';
import { HOVER_DEFAULTS, type HoverConfig } from '@/configs/hoverConfig';
interface LevaState {
  gallery: GalleryConfig;
  setGallery: (gallery: GalleryConfig) => void;
  liquidGlass: LiquidGlassConfig;
  setLiquidGlass: (liquidGlass: LiquidGlassConfig) => void;
  colorCorrections: ColorCorrectionsConfig;
  setColorCorrections: (colorCorrections: ColorCorrectionsConfig) => void;
  edgeBend: EdgeBendConfig;
  setEdgeBend: (edgeBend: EdgeBendConfig) => void;
  vignette: VignetteConfig;
  setVignette: (vignette: VignetteConfig) => void;
  motion: MotionConfig;
  setMotion: (motion: MotionConfig) => void;
  hover: HoverConfig;
  setHover: (hover: HoverConfig) => void;
}

export const useLevaStore = create<LevaState>((set) => ({
  gallery: GALLERY_DEFAULTS,
  setGallery: (gallery) => set({ gallery }),
  liquidGlass: LIQUID_GLASS_DEFAULTS,
  setLiquidGlass: (liquidGlass) => set({ liquidGlass }),
  colorCorrections: COLOR_CORRECTIONS_DEFAULTS,
  setColorCorrections: (colorCorrections) => set({ colorCorrections }),
  edgeBend: EDGE_BEND_DEFAULTS,
  setEdgeBend: (edgeBend) => set({ edgeBend }),
  vignette: VIGNETTE_DEFAULTS,
  setVignette: (vignette) => set({ vignette }),
  motion: MOTION_DEFAULTS,
  setMotion: (motion) => set({ motion }),
  hover: HOVER_DEFAULTS,
  setHover: (hover) => set({ hover }),
}));
