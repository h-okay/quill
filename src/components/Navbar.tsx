import { getUserSubscriptionPlan } from '@/lib/stripe';
import { cn } from '@/lib/utils';
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import MaxWidthWrapper from './MaxWidthWrapper';
import MobileNav from './MobileNav';
import UserAccountNav from './UserAccountNav';
import { buttonVariants } from './ui/button';

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 dark:border-[#2d2d2d] bg-white/75 backdrop-blur-lg transition-all dark:text-white dark:bg-[#0a0a0a]">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-[#2d2d2d]">
          <Link href="/" className="z-40 flex font-semibold">
            <span>quill.</span>
          </Link>
          <MobileNav isAuth={!!user} isPro={subscriptionPlan.isSubscribed} />
          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={cn(
                    buttonVariants({
                      size: 'sm',
                    }),
                    'dark:text-white',
                  )}
                >
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? 'Your Account'
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email || ''}
                  imageUrl={user.picture || ''}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
