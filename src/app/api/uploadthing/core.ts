import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { type FileRouter, createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

const auth = (req: Request) => ({ id: 'fakeId' });

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
        .middleware(async ({ req }) => {
            const { getUser } = getKindeServerSession();
            const user = await getUser();
            if (!user || !user.id) throw new Error('Unauthorized');
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const createdFile = await db.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userId: metadata.userId,
                    url: file.url, // or `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}` if it fails,
                    uploadStatus: 'PROCESSING',
                },
            });
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
