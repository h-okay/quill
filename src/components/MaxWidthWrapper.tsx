import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type MaxWidthWrapperProps = {
  className?: string;
  children: ReactNode;
};

export default function MaxWidthWrapper({
  className,
  children,
}: MaxWidthWrapperProps) {
  return (
    <div
      className={cn('max-wscreen-xl mx-auto w-full px-2.5 md:px-20', className)}
    >
      {children}
    </div>
  );
}
