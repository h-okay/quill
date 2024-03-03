'use client';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

import { Icons } from './Icons';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export default function ThemeSwitch({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={cn('flex justify-center items-center gap-2', className)}>
      <Switch
        id="theme-switch"
        onClick={toggleTheme}
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      />
      <Label htmlFor="theme-switch">
        {theme === 'dark' ? (
          <Icons.sun className="h-5 w-5" />
        ) : (
          <Icons.moon className="h-5 w-5" />
        )}
      </Label>
    </div>
  );
}
