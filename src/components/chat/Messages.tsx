import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { useChat } from '@/context/ChatContext';
import { ExtendedMessage } from '@/types/message';
import { useIntersection } from '@mantine/hooks';
import { Loader2, MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import Message from './Message';

type MessagesProps = {
  fileId: string;
};

export default function Messages({ fileId }: MessagesProps) {
  const { isLoading: isAiThinking } = useChat();

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        // keepPreviousData: true, // TODO:
      },
    );

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };
  const messages = data?.pages.flatMap((page) => page.messages);
  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((msg, idx) => {
          const isNextMessageSamePerson =
            combinedMessages[idx - 1]?.isUserMessage ===
            combinedMessages[idx]?.isUserMessage;

          if (idx === combinedMessages.length - 1) {
            return (
              <Message
                ref={ref}
                key={msg.id}
                message={msg as ExtendedMessage}
                isNextMessageSamePerson={isNextMessageSamePerson}
              />
            );
          }
          return (
            <Message
              key={msg.id}
              message={msg as ExtendedMessage}
              isNextMessageSamePerson={isNextMessageSamePerson}
            />
          );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16 dark:bg-[#0a0a0a]" />
          <Skeleton className="h-16 dark:bg-[#0a0a0a]" />
          <Skeleton className="h-16 dark:bg-[#0a0a0a]" />
          <Skeleton className="h-16 dark:bg-[#0a0a0a]" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
}
