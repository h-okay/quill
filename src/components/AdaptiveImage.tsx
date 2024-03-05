'use client';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type AdaptiveImageProps = {
  altText: string;
  width: number;
  height: number;
  darkSrc: string;
  lightSrc: string;
};

export default function AdaptiveImage({
  altText,
  width,
  height,
  darkSrc,
  lightSrc,
}: AdaptiveImageProps) {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === 'light' ? lightSrc : darkSrc}
      width={width}
      height={height}
      quality={100}
      alt={altText}
      className="rounded-md bg-white p-2 shadow-2xl ring-1 ring-gray-900/1 dark:ring-[#252525] dark:bg-[#0a0a0a]"
    />
  );
}
