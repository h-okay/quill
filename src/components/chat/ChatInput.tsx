import { useChat } from '@/context/ChatContext';
import { Send } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

type ChatInputProps = {
  isDisabled?: boolean;
};

export default function ChatInput({ isDisabled }: ChatInputProps) {
  const { addMessage, message, handleInputChange, isLoading } = useChat();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full dark:bg-[#0a0a0a]">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={textAreaRef}
                placeholder="Enter your question..."
                rows={1}
                maxRows={4}
                autoFocus
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textAreaRef.current?.focus();
                  }
                }}
              />
              <Button
                disabled={isLoading || isDisabled}
                aria-label="send message"
                className="absolute bottom-1.5 right-[8px]"
                onClick={() => {
                  addMessage();
                  textAreaRef.current?.focus();
                }}
              >
                <Send className="h-4 w-4 dark:text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
