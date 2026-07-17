// Rendering parameters of github.com/ybouane/liquidglass (liquid-glass.ybouane.com),
// same names and defaults. floating/button are omitted — they are DOM drag/press
// behaviors, not part of the shader.
export type LiquidGlassConfig = {
  /** Background blur strength (0 = sharp, 1 = maximum blur). */
  blurAmount: number
  /** Refraction strength — how much the glass bends the image behind it */
  refraction: number
  /** Chromatic aberration — color fringing at edges */
  chromAberration: number
  /** Edge highlight intensity (inner glow / rim lighting) */
  edgeHighlight: number
  /** Specular highlight intensity (Blinn-Phong) */
  specular: number
  /** Fresnel reflection intensity at grazing angles */
  fresnel: number
  /** Micro-distortion noise strength */
  distortion: number
  /** Corner radius in CSS pixels */
  cornerRadius: number
  /** Z-radius (bevel depth) — controls the curvature of the pill bevel */
  zRadius: number
  /** Overall opacity of the glass panel */
  opacity: number
  /** Saturation adjustment (-1 = desaturated, 0 = normal, 1 = vivid) */
  saturation: number
  /** Tint strength — cool blue-ish glass tint */
  tintStrength: number
  /** Brightness adjustment (-0.5 to 0.5) */
  brightness: number
  /** Shadow opacity (0 = no shadow, 1 = full black) */
  shadowOpacity: number
  /** Shadow spread in CSS pixels */
  shadowSpread: number
  /** Shadow vertical offset in CSS pixels */
  shadowOffsetY: number
  /** Bevel mode: 0 = biconvex pill, 1 = dome (flat bottom). */
  bevelMode: number
  /**
   * Card width in px that all px-based values (cornerRadius, zRadius, shadow)
   * are measured against. Smaller = chunkier glass. 160 reproduces the look
   * where a 35px radius is nearly a pill on a 16:9 card.
   */
  referenceWidth: number
}

export const LIQUID_GLASS_DEFAULTS: LiquidGlassConfig = {
  blurAmount: 0.0,
  refraction: 0.75,
  chromAberration: 0.05,
  edgeHighlight: 0.04,
  specular: 0.0,
  fresnel: 1.0,
  distortion: 0.0,
  cornerRadius: 4,
  zRadius: 12,
  opacity: 1.0,
  saturation: 0.03,
  tintStrength: 1.0,
  brightness: 0.08,
  shadowOpacity: 0,
  shadowSpread: 0,
  shadowOffsetY: 0,
  bevelMode: 0,
  referenceWidth: 160,
}
