'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { IMAGES } from '@/configs/projects'
import { LIQUID_GLASS_DEFAULTS } from '@/configs/liquidGlassConfig'
import { useLevaStore } from '@/stores/levaStore'

const TILE_W = 16
const TILE_H = 9
const SHADOW_PAD_W = 1
const PATTERN_COLS = 8
const PATTERN_ROWS = 24
const BASE_COLS_LANDSCAPE = 3.4
const BASE_COLS_PORTRAIT = 2.0
const MAX_VEL = 80

const sim = {
  tx: 0,
  ty: 0,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  zoom: 10,
  dragging: false,
  lastX: 0,
  lastY: 0,
  lastT: 0,
}

const mod = (n: number, m: number) => ((n % m) + m) % m
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

type Tile = {
  key: string
  col: number
  row: number
  tex: number
}

const TILES: Tile[] = (() => {
  const list: Tile[] = []
  for (let row = 0; row < PATTERN_ROWS; row++) {
    for (let col = 0; col < PATTERN_COLS; col++) {
      list.push({
        key: `${col}-${row}`,
        col,
        row,
        tex: (col + row * 3) % IMAGES.length,
      })
    }
  }
  return list
})()

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Port of FS_GLASS from github.com/ybouane/liquidglass (src/shaders.ts), verbatim
// where possible. The card's image is the "background" texture; local pixel
// coords are y-down like the original's DOM space. The quad is padded by
// SHADOW_PAD_W world units so the drop shadow can render outside the card.
const FRAG = `
uniform sampler2D uMap;
uniform float uZoom;
uniform float uRadiusPx;
uniform float uBlurSigma;
uniform float uRefract;
uniform float uChroma;
uniform float uEdgeHL;
uniform float uSpec;
uniform float uFresnel;
uniform float uDistort;
uniform float uAlpha;
uniform float uSat;
uniform float uTint;
uniform float uZRadius;
uniform float uBrightness;
uniform float uShadowAlpha;
uniform float uShadowSpread;
uniform float uShadowOffY;
uniform float uBevelMode;
uniform float uCcBrightness;
uniform float uCcContrast;
uniform float uCcSaturation;
uniform float uCcHue;
varying vec2 vUv;

float rrSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - r;
}

// mode 0 = biconvex pill — light refracts at both surfaces (entry + exit).
// mode 1 = dome (plano-convex) — flat bottom, so only exit refraction.
float bevelHeight(float d, float zR) {
  if (d <= 0.0) return 0.0;
  if (d >= zR) return zR;
  return sqrt(d * (2.0 * zR - d));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Gaussian blur: a coarse mip carries the bulk of the radius, a 3x3 gaussian
// kernel at sigma spacing smooths the mip blockiness away.
vec3 sampleBlur(vec2 uv) {
  if (uBlurSigma < 0.25) return texture2D(uMap, uv).rgb;
  float bias = max(log2(uBlurSigma) - 1.0, 0.0);
  vec2 s = vec2(uBlurSigma) / (vec2(${TILE_W.toFixed(1)}, ${TILE_H.toFixed(1)}) * uZoom) * 0.8;
  vec3 c = texture2D(uMap, uv, bias).rgb * 4.0;
  c += texture2D(uMap, uv + vec2(s.x, 0.0), bias).rgb * 2.0;
  c += texture2D(uMap, uv - vec2(s.x, 0.0), bias).rgb * 2.0;
  c += texture2D(uMap, uv + vec2(0.0, s.y), bias).rgb * 2.0;
  c += texture2D(uMap, uv - vec2(0.0, s.y), bias).rgb * 2.0;
  c += texture2D(uMap, uv + s, bias).rgb;
  c += texture2D(uMap, uv - s, bias).rgb;
  c += texture2D(uMap, uv + vec2(s.x, -s.y), bias).rgb;
  c += texture2D(uMap, uv + vec2(-s.x, s.y), bias).rgb;
  return c / 16.0;
}

// CSS filter-effects hue-rotate matrix
vec3 hueRotate(vec3 c, float deg) {
  float a = radians(deg);
  float cs = cos(a);
  float sn = sin(a);
  mat3 m = mat3(
    0.213 + cs * 0.787 - sn * 0.213, 0.213 - cs * 0.213 + sn * 0.143, 0.213 - cs * 0.213 - sn * 0.787,
    0.715 - cs * 0.715 - sn * 0.715, 0.715 + cs * 0.285 + sn * 0.140, 0.715 - cs * 0.715 + sn * 0.715,
    0.072 - cs * 0.072 + sn * 0.928, 0.072 - cs * 0.072 - sn * 0.283, 0.072 + cs * 0.928 + sn * 0.072
  );
  return m * c;
}

void main() {
  vec2 sizePx = vec2(${TILE_W.toFixed(1)}, ${TILE_H.toFixed(1)}) * uZoom;
  float padPx = ${SHADOW_PAD_W.toFixed(1)} * uZoom;
  vec2 totalPx = sizePx + vec2(padPx * 2.0);
  // local px from panel centre, y-down like the original's DOM coords
  vec2 lp = vec2((vUv.x - 0.5) * totalPx.x, (0.5 - vUv.y) * totalPx.y);

  vec2 half_ = sizePx * 0.5;
  float r = min(uRadiusPx, min(half_.x, half_.y));
  float sdf = rrSDF(lp, half_, r);

  // ── Shadow (outside panel, offset by shadowOffY) ──
  if (sdf > 0.0) {
    float sdfShadow = rrSDF(lp - vec2(0.0, uShadowOffY), half_, r);
    float d = max(sdfShadow - 1.0, 0.0);
    float spread = max(uShadowSpread, 1.0);
    float falloff = 1.0 / (spread * spread);
    float outerShadow = exp(-d * d * falloff) * 0.65;
    float contactShadow = exp(-d * 0.08 / max(spread * 0.04, 0.01)) * 0.35;
    float shadow = (outerShadow + contactShadow) * uShadowAlpha;
    gl_FragColor = vec4(0.0, 0.0, 0.0, shadow);
    return;
  }

  // ── Anti-aliased mask ──
  float mask = 1.0 - smoothstep(-1.5, 0.5, sdf);

  float maxD = min(half_.x, half_.y);
  float inside = -sdf;
  float edge = smoothstep(maxD * 0.35, 0.0, inside);

  // ── Surface normal (top surface) via bevel height field ──
  float zR = uZRadius;
  float e = 2.0;
  float dC = inside;
  float dR = -rrSDF(lp + vec2(e, 0.0), half_, r);
  float dL = -rrSDF(lp - vec2(e, 0.0), half_, r);
  float dU = -rrSDF(lp + vec2(0.0, e), half_, r);
  float dD = -rrSDF(lp - vec2(0.0, e), half_, r);
  float hC = bevelHeight(dC, zR);
  float hR = bevelHeight(dR, zR);
  float hL = bevelHeight(dL, zR);
  float hU = bevelHeight(dU, zR);
  float hD = bevelHeight(dD, zR);
  vec2 hGrad = vec2(hR - hL, hU - hD) / (2.0 * e);
  vec3 N = normalize(vec3(-hGrad, 1.0));

  float depth = smoothstep(0.0, zR, inside);

  // ── Refraction ──
  vec2 pxToUV = vec2(1.0, -1.0) / sizePx;
  float ior = 1.5;
  float refrPow = 1.0 - 1.0 / ior;
  float thickness = hC * 2.0;
  float thickNorm = thickness / max(zR * 2.0, 1.0);
  vec2 refrPx;
  if (uBevelMode < 0.5) {
    // Biconvex: physically-based dual-surface refraction
    vec2 exitRefr = hGrad * refrPow;
    vec2 entryRefr = hGrad * refrPow;
    vec2 throughRefr = entryRefr * thickNorm * 0.5;
    refrPx = (exitRefr + entryRefr + throughRefr) * uRefract * 30.0;
    vec2 centerDir = -lp / max(half_, vec2(1.0));
    refrPx += centerDir * uRefract * 4.0 * depth;
  } else {
    // Dome (plano-convex): uniform magnification by contracting UV toward center
    refrPx = -lp * uRefract * depth * 0.35;
  }
  vec2 refr = refrPx * pxToUV;

  // ── Micro-distortion noise ──
  vec2 ns = lp * 0.08;
  vec2 absPxToUV = vec2(1.0) / sizePx;
  vec2 micro = (vec2(hash(ns), hash(ns + vec2(37.0))) - 0.5) * uDistort * 4.0 * absPxToUV;

  // ── Chromatic aberration ──
  float caS = uChroma * 18.0 * (edge * 0.7 + 0.3) * 2.0;
  vec2 caD = N.xy * caS * pxToUV;
  vec2 base = vec2(0.5 + lp.x / sizePx.x, 0.5 - lp.y / sizePx.y) + refr + micro;

  vec3 sharp = vec3(
    texture2D(uMap, base + caD).r,
    texture2D(uMap, base).g,
    texture2D(uMap, base - caD).b
  );
  vec3 blur = vec3(
    sampleBlur(base + caD).r,
    sampleBlur(base).g,
    sampleBlur(base - caD).b
  );
  // ── Edge-weighted blur mix ──
  float edgeMix = (1.0 - edge * 0.15);
  vec3 col = mix(sharp, blur, edgeMix);

  // ── Per-image color correction ──
  col = hueRotate(col, uCcHue);
  float ccLum = dot(col, vec3(0.213, 0.715, 0.072));
  col = mix(vec3(ccLum), col, 1.0 + uCcSaturation);
  col = (col - 0.5) * (1.0 + uCcContrast) + 0.5;
  col *= 1.0 + uCcBrightness;

  // ── Brightness ──
  col *= 1.0 + uBrightness;

  // ── Saturation ──
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, 1.0 + uSat);

  // ── Cool glass tint ──
  col = mix(col, col * vec3(0.92, 0.95, 1.05), uTint);
  col *= 1.0 + 0.06 * depth;

  // ── Fresnel ──
  float fres = pow(1.0 - abs(N.z), 4.0) * uFresnel;

  // ── Specular highlights (multi-light Blinn-Phong) ──
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L1 = normalize(vec3(0.4, 0.7, 1.0));
  vec3 H1 = normalize(L1 + V);
  float sp1 = pow(max(dot(N, H1), 0.0), 90.0);
  vec3 L2 = normalize(vec3(-0.3, -0.5, 1.0));
  vec3 H2 = normalize(L2 + V);
  float sp2 = pow(max(dot(N, H2), 0.0), 50.0) * 0.3;
  vec3 L3 = normalize(vec3(0.1, 0.3, 1.0));
  float spB = pow(max(dot(N, L3), 0.0), 6.0) * 0.1;
  vec3 L4 = normalize(vec3(0.0, 0.9, 0.4));
  vec3 H4 = normalize(L4 + V);
  float sp4 = pow(max(dot(N, H4), 0.0), 120.0) * 0.6;
  float totalSpec = (sp1 + sp2 + spB + sp4) * uSpec;

  // ── Inner border / stroke highlight ──
  float borderWidth = 1.5;
  float innerStroke = smoothstep(-borderWidth - 1.0, -borderWidth, sdf)
                    * (1.0 - smoothstep(-1.0, 0.0, sdf));
  float topBias = 0.5 + 0.5 * (-lp.y / half_.y);
  innerStroke *= (0.4 + 0.6 * topBias);

  // ── Edge highlight & inner glow ──
  float rim = edge * uEdgeHL * 0.22;
  float innerGlow = smoothstep(5.0, 0.0, -sdf) * uEdgeHL * 0.15;

  // ── Environment-like reflection (fake) ──
  float envRefl = (N.y * 0.5 + 0.5) * fres * 0.08;

  // ── Composite ──
  vec3 fin = col;
  fin += vec3(totalSpec);
  fin += vec3(rim + innerGlow);
  fin += vec3(innerStroke * uEdgeHL * 0.55);
  fin += vec3(envRefl);
  fin = mix(fin, vec3(1.0), fres * 0.2);

  gl_FragColor = vec4(fin, mask * uAlpha);
}
`

function Space() {
  const textures = useTexture(IMAGES)
  const gl = useThree((s) => s.gl)
  const cfg = useLevaStore((s) => s.gallery)
  const glass = useLevaStore((s) => s.liquidGlass)
  const corrections = useLevaStore((s) => s.colorCorrections)

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy()
    textures.forEach((t) => {
      t.anisotropy = maxAniso
      // refraction pushes samples past the image edge; mirroring reads far
      // better there than clamped edge streaks
      t.wrapS = THREE.MirroredRepeatWrapping
      t.wrapT = THREE.MirroredRepeatWrapping
      t.needsUpdate = true
    })
  }, [textures, gl])

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(TILE_W + SHADOW_PAD_W * 2, TILE_H + SHADOW_PAD_W * 2),
    [],
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  const materials = useMemo(
    () =>
      textures.map(
        (t) =>
          new THREE.ShaderMaterial({
            uniforms: {
              uMap: { value: t },
              uZoom: { value: LIQUID_GLASS_DEFAULTS.referenceWidth / TILE_W },
              uRadiusPx: { value: LIQUID_GLASS_DEFAULTS.cornerRadius },
              uBlurSigma: { value: LIQUID_GLASS_DEFAULTS.blurAmount * 11 },
              uRefract: { value: LIQUID_GLASS_DEFAULTS.refraction },
              uChroma: { value: LIQUID_GLASS_DEFAULTS.chromAberration },
              uEdgeHL: { value: LIQUID_GLASS_DEFAULTS.edgeHighlight },
              uSpec: { value: LIQUID_GLASS_DEFAULTS.specular },
              uFresnel: { value: LIQUID_GLASS_DEFAULTS.fresnel },
              uDistort: { value: LIQUID_GLASS_DEFAULTS.distortion },
              uAlpha: { value: LIQUID_GLASS_DEFAULTS.opacity },
              uSat: { value: LIQUID_GLASS_DEFAULTS.saturation },
              uTint: { value: LIQUID_GLASS_DEFAULTS.tintStrength },
              uZRadius: { value: LIQUID_GLASS_DEFAULTS.zRadius },
              uBrightness: { value: LIQUID_GLASS_DEFAULTS.brightness },
              uShadowAlpha: { value: LIQUID_GLASS_DEFAULTS.shadowOpacity },
              uShadowSpread: { value: LIQUID_GLASS_DEFAULTS.shadowSpread },
              uShadowOffY: { value: LIQUID_GLASS_DEFAULTS.shadowOffsetY },
              uBevelMode: { value: LIQUID_GLASS_DEFAULTS.bevelMode },
              uCcBrightness: { value: 0 },
              uCcContrast: { value: 0 },
              uCcSaturation: { value: 0 },
              uCcHue: { value: 0 },
            },
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            depthWrite: false,
          }),
      ),
    [textures],
  )
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials])

  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ camera, size }, delta) => {
    const stepX = TILE_W + cfg.gap
    const stepY = TILE_H + cfg.gap
    const totW = PATTERN_COLS * stepX
    const totH = PATTERN_ROWS * stepY

    const baseCols = size.width > size.height ? BASE_COLS_LANDSCAPE : BASE_COLS_PORTRAIT
    const zoom = size.width / ((baseCols / cfg.imageSize) * stepX)
    if (Math.abs(camera.zoom - zoom) > 1e-4) {
      camera.zoom = zoom
      camera.updateProjectionMatrix()
    }
    sim.zoom = zoom

    const f = Math.min(delta * 60, 3)

    if (!sim.dragging) {
      sim.tx += sim.vx * f
      sim.ty += sim.vy * f
      const decay = Math.pow(cfg.friction, f)
      sim.vx *= decay
      sim.vy *= decay
      if (Math.abs(sim.vx) < 0.04) sim.vx = 0
      if (Math.abs(sim.vy) < 0.04) sim.vy = 0
    }

    const k = 1 - Math.pow(1 - cfg.smoothing, f)
    sim.x += (sim.tx - sim.x) * k
    sim.y += (sim.ty - sim.y) * k

    // half-step shift so the initial view centers on the gap between images
    // rather than on a single centered image
    const wpp = 1 / sim.zoom
    const offX = sim.x * wpp + stepX * 0.5
    const offY = -sim.y * wpp + stepY * 0.5

    for (let i = 0; i < TILES.length; i++) {
      const mesh = meshRefs.current[i]
      if (!mesh) continue
      const t = TILES[i]
      mesh.position.x = mod(t.col * stepX + offX, totW) - totW / 2
      mesh.position.y = mod(t.row * stepY + offY, totH) - totH / 2
      const u = (mesh.material as THREE.ShaderMaterial).uniforms
      // glass px values are measured against a fixed reference card width, so
      // the look is identical at every window size and zoom level
      u.uZoom.value = glass.referenceWidth / TILE_W
      u.uRadiusPx.value = glass.cornerRadius
      u.uBlurSigma.value = glass.blurAmount * 11
      u.uRefract.value = glass.refraction
      u.uChroma.value = glass.chromAberration
      u.uEdgeHL.value = glass.edgeHighlight
      u.uSpec.value = glass.specular
      u.uFresnel.value = glass.fresnel
      u.uDistort.value = glass.distortion
      u.uAlpha.value = glass.opacity
      u.uSat.value = glass.saturation
      u.uTint.value = glass.tintStrength
      u.uZRadius.value = glass.zRadius
      u.uBrightness.value = glass.brightness
      u.uShadowAlpha.value = glass.shadowOpacity
      u.uShadowSpread.value = glass.shadowSpread
      u.uShadowOffY.value = glass.shadowOffsetY
      u.uBevelMode.value = glass.bevelMode
      const cc = corrections[t.tex]
      if (cc) {
        u.uCcBrightness.value = cc.brightness
        u.uCcContrast.value = cc.contrast
        u.uCcSaturation.value = cc.saturation
        u.uCcHue.value = cc.hue
      }
    }
  })

  return (
    <group>
      {TILES.map((t, i) => (
        <mesh
          key={t.key}
          geometry={geometry}
          material={materials[t.tex]}
          position={[
            t.col * (TILE_W + cfg.gap),
            t.row * (TILE_H + cfg.gap),
            0,
          ]}
          ref={(m) => {
            meshRefs.current[i] = m
          }}
        />
      ))}
    </group>
  )
}

export default function Gallery() {
  const rootRef = useRef<HTMLDivElement>(null)
  const background = useLevaStore((s) => s.gallery.background)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const speed = useLevaStore.getState().gallery.wheelSpeed
      sim.tx -= e.deltaX * speed
      sim.ty -= e.deltaY * speed
    }
    root.addEventListener('wheel', onWheel, { passive: false })
    return () => root.removeEventListener('wheel', onWheel)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    rootRef.current?.setPointerCapture(e.pointerId)
    rootRef.current?.setAttribute('data-dragging', 'true')
    sim.dragging = true
    sim.vx = 0
    sim.vy = 0
    sim.lastX = e.clientX
    sim.lastY = e.clientY
    sim.lastT = e.timeStamp
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!sim.dragging) return
    const speed = useLevaStore.getState().gallery.dragSpeed
    const dx = (e.clientX - sim.lastX) * speed
    const dy = (e.clientY - sim.lastY) * speed
    const dt = Math.max(e.timeStamp - sim.lastT, 1)
    sim.tx += dx
    sim.ty += dy
    sim.vx = sim.vx * 0.7 + (dx / dt) * 16.7 * 0.3
    sim.vy = sim.vy * 0.7 + (dy / dt) * 16.7 * 0.3
    sim.lastX = e.clientX
    sim.lastY = e.clientY
    sim.lastT = e.timeStamp
  }

  const endDrag = () => {
    if (!sim.dragging) return
    sim.dragging = false
    sim.vx = clamp(sim.vx, -MAX_VEL, MAX_VEL)
    sim.vy = clamp(sim.vy, -MAX_VEL, MAX_VEL)
    rootRef.current?.removeAttribute('data-dragging')
  }

  return (
    <div
      ref={rootRef}
      className="gallery-root"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas
        flat
        orthographic
        dpr={[1, 2]}
        camera={{ position: [0, 0, 100], near: 0.1, far: 200, zoom: 10 }}
      >
        <color attach="background" args={[background]} />
        <Suspense fallback={null}>
          <Space />
        </Suspense>
      </Canvas>
    </div>
  )
}
