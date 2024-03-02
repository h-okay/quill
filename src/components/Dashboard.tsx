'use client';

import { trpc } from '@/app/_trpc/client';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { Ghost } from 'lucide-react';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import File from './File';
import UploadButton from './UploadButton';

type DashboardProps = {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
};

export default function Dashboard({ subscriptionPlan }: DashboardProps) {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >();

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 text-5xl font-bold text-gray-900">My Files</h1>
        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </div>

      {/* display all user files */}
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((f) => (
              <File
                key={f.id}
                fileId={f.id}
                fileName={f.name}
                fileCreatedAt={f.created_at}
                isCurrentlyDeleting={currentlyDeletingFile === f.id}
                deleteHandler={setCurrentlyDeletingFile}
              />
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="text-xl font-semibold">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
}
