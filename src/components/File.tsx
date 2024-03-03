'use client';

import { trpc } from '@/app/_trpc/client';
import { format } from 'date-fns';
import { Loader2, MessageSquare, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

import { Button } from './ui/button';

type FileProps = {
  fileName: string;
  fileId: string;
  fileCreatedAt: string;
  isCurrentlyDeleting: boolean;
  deleteHandler: Dispatch<SetStateAction<string | null | undefined>>;
};

export default function File({
  fileId,
  fileName,
  fileCreatedAt,
  isCurrentlyDeleting,
  deleteHandler,
}: FileProps) {
  const utils = trpc.useUtils();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      deleteHandler(id);
    },
    onSettled: () => {
      deleteHandler(null);
    },
  });

  const { data, isFetched } = trpc.getFileMessageCount.useQuery({ fileId });

  return (
    <li
      key={fileId}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg dark:bg-[#0a0a0a] dark:border dark:border-[#252525] dark:hover:border-white dark:divide-[#252525]"
    >
      <Link href={`/dashboard/${fileId}`} className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg font-medium text-zinc-900 dark:text-white">
                {fileName}
              </h3>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-zinc-500 dark:text-white">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(fileCreatedAt), 'MMM yyyy')}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {!isFetched ? (
            <Loader2 className="h-2 w-2 text-gray-300 animate-spin" />
          ) : (
            data?.count
          )}
        </div>
        <Button
          size="sm"
          className="w-full"
          variant="destructive"
          onClick={() => deleteFile({ id: fileId })}
        >
          {isCurrentlyDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </div>
    </li>
  );
}
