'use client';

import { ArrowRight, Gem, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import ThemeSwitch from './ThemeSwitch';

type MobileNavProps = {
  isAuth: boolean;
  isPro: boolean;
};

export default function MobileNav({ isAuth, isPro }: MobileNavProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const toggleOpen = () => setOpen((prev) => !prev);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden flex gap-2">
      <ThemeSwitch logoOnly className="z-10" />
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-8 w-h-8 text-zinc-700"
      />
      {isOpen ? (
        <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
          <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8 dark:bg-[#0a0a0a] dark:border-[#2d2d2d]">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/sign-up')}
                    className="flex items-center w-full font-semibold text-green-600"
                    href="/sign-up"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300 dark:bg-[#2d2d2d]" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/sign-in')}
                    className="flex items-center w-full font-semibold"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300 dark:bg-[#2d2d2d]" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/pricing')}
                    className="flex items-center w-full font-semibold"
                    href="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent('/dashboard')}
                    className="flex items-center w-full font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300 dark:bg-[#2d2d2d]" />
                {isPro ? (
                  <li>
                    <Link
                      onClick={() => closeOnCurrent('/dashboard/billing')}
                      className="flex items-center w-full font-semibold"
                      href="/dashboard/billing"
                    >
                      Manage Subscription
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      onClick={() => closeOnCurrent('/pricing')}
                      className="flex items-center w-full font-semibold"
                      href="/pricing"
                    >
                      Upgrade <Gem className="text-blue-600 h-4 w-4 ml-1.5" />
                    </Link>
                  </li>
                )}
                <li className="my-3 h-px w-full bg-gray-300 dark:bg-[#2d2d2d]" />
                <li>
                  <Link
                    className="flex items-center w-full font-semibold"
                    href="/sign-out"
                  >
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
