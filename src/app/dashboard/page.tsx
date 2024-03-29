import Dashboard from '@/components/Dashboard';
import { db } from '@/db';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  // user exists on auth provider
  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  // user exists on db, if not sync db
  if (!dbUser) redirect('/auth-callback?origin=dashboard');

  const subscriptionPlan = await getUserSubscriptionPlan();
  return <Dashboard subscriptionPlan={subscriptionPlan} />;
}
