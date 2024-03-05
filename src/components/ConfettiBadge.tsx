'use client';

import { useState } from 'react';
import Realistic from 'react-canvas-confetti/dist/presets/fireworks';
import { TConductorInstance } from 'react-canvas-confetti/dist/types';

type ConfettiBadgeProps = {
  text: string;
};

export default function ConfettiBadge({ text }: ConfettiBadgeProps) {
  const [conductor, setConductor] = useState<TConductorInstance>();

  const onOnce = () => {
    conductor?.shoot();
  };

  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    setConductor(conductor);
  };

  return (
    <>
      <div
        className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50 dark:hover:border-white dark:bg-[#0a0a0a] dark:border-[#2d2d2d]"
        onMouseEnter={onOnce}
      >
        <p className="text-sm font-semibold text-gray-700 dark:text-white cursor-default">
          {text}
        </p>
      </div>
      <Realistic onInit={onInit} />
    </>
  );
}
