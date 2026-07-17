'use client';

import { useEffect, useState } from 'react';
import { Leva } from 'leva';
import { useGalleryTweaks } from '@/hooks/leva/useGalleryTweaks';
import { useLiquidGlassTweaks } from '@/hooks/leva/useLiquidGlassTweaks';
import { useColorCorrectionsTweaks } from '@/hooks/leva/useColorCorrectionsTweaks';
import { useEdgeBendTweaks } from '@/hooks/leva/useEdgeBendTweaks';
import { useVignetteTweaks } from '@/hooks/leva/useVignetteTweaks';
import { useMotionTweaks } from '@/hooks/leva/useMotionTweaks';

export default function LevaControls() {
  useGalleryTweaks();
  useLiquidGlassTweaks();
  useColorCorrectionsTweaks();
  useEdgeBendTweaks();
  useVignetteTweaks();
  useMotionTweaks();

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'h') return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      setHidden((prev) => !prev);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <Leva collapsed hidden={hidden} />;
}
