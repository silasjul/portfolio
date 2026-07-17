'use client';

import { useEffect, useState } from 'react';
import { Leva } from 'leva';
import { useGalleryTweaks } from '@/hooks/leva/useGalleryTweaks';
import { useLiquidGlassTweaks } from '@/hooks/leva/useLiquidGlassTweaks';
import { useColorCorrectionsTweaks } from '@/hooks/leva/useColorCorrectionsTweaks';

export default function LevaControls() {
  useGalleryTweaks();
  useLiquidGlassTweaks();
  useColorCorrectionsTweaks();

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
