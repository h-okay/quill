import PdfRenderer from '@/components/PdfRenderer';
import Resizable from '@/components/Resizable';
import ChatWrapper from '@/components/chat/ChatWrapper';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';

type FileIdProps = {
  params: {
    fileId: string;
  };
};

export default async function FileId({ params }: FileIdProps) {
  // retrive the file id
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  // make db call to get all the details
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <Resizable file={file} />
      <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex lg:hidden">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 lg:hidden">
            <PdfRenderer url={file.url} />
          </div>
        </div>
        <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0 dark:border-[#252525] lg:hidden">
          <ChatWrapper fileId={fileId} />
        </div>
      </div>
    </div>
  );
}
