'use client';

import { trpc } from '@/app/_trpc/client';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import MaxWidthWrapper from './MaxWidthWrapper';
import { Button } from './ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useToast } from './ui/use-toast';

type BillingFormProps = {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
};
export default function BillingForm({ subscriptionPlan }: BillingFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
      if (!url) {
        toast({
          title: 'There was a problem...',
          description: 'Please try again in a moment',
          variant: 'destructive',
        });
      }
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return (
    <MaxWidthWrapper className="max-w-4xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card className="dark:border dark:border-[#252525] dark:bg-[#0a0a0a]">
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name || "free"}</strong>{' '}
              plan.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-end space-y-2 md:flex-row md:justify-between md:space-x-0">
            <Button type="submit" className='dark:text-white'>
              {isLoading ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? 'Manage Subscription'
                : 'Upgrade to PRO'}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? 'Your plan will be canceled on '
                  : 'Your plan renews on '}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
}
