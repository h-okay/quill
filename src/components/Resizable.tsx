'use client';

import { File } from '@prisma/client';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import PdfRenderer from './PdfRenderer';
import ChatWrapper from './chat/ChatWrapper';

type ResizableProps = {
  file: File;
};

export default function Resizable({ file }: ResizableProps) {
  return (
    <PanelGroup direction="horizontal" className="hidden">
      <Panel defaultSize={50} minSize={30} className="hidden lg:block">
        <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 hidden lg:block">
          <PdfRenderer url={file.url} />
        </div>
      </Panel>
      <PanelResizeHandle className="hidden lg:block" />
      <Panel
        defaultSize={50}
        minSize={30}
        className="border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0 dark:border-[#252525] hidden lg:block"
      >
        <ChatWrapper fileId={file.id} />
      </Panel>
    </PanelGroup>
  );
}
