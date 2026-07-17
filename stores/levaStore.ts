import { create } from 'zustand';
import { GALLERY_DEFAULTS, type GalleryConfig } from '@/configs/galleryConfig';
import { LIQUID_GLASS_DEFAULTS, type LiquidGlassConfig } from '@/configs/liquidGlassConfig';
import {
  COLOR_CORRECTIONS_DEFAULTS,
  type ColorCorrectionsConfig,
} from '@/configs/colorCorrectionsConfig';
interface LevaState {
  gallery: GalleryConfig;
  setGallery: (gallery: GalleryConfig) => void;
  liquidGlass: LiquidGlassConfig;
  setLiquidGlass: (liquidGlass: LiquidGlassConfig) => void;
  colorCorrections: ColorCorrectionsConfig;
  setColorCorrections: (colorCorrections: ColorCorrectionsConfig) => void;
}

export const useLevaStore = create<LevaState>((set) => ({
  gallery: GALLERY_DEFAULTS,
  setGallery: (gallery) => set({ gallery }),
  liquidGlass: LIQUID_GLASS_DEFAULTS,
  setLiquidGlass: (liquidGlass) => set({ liquidGlass }),
  colorCorrections: COLOR_CORRECTIONS_DEFAULTS,
  setColorCorrections: (colorCorrections) => set({ colorCorrections }),
}));
