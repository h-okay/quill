import { db } from '@/db';
import { pinecone } from '@/lib/pinecone';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { type FileRouter, createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

const auth = (req: Request) => ({ id: 'fakeId' });

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();
      if (!user || !user.id) throw new Error('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url, // or `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}` if it fails
          uploadStatus: 'PROCESSING',
        },
      });

      try {
        // TODO: make sure the integration works after getting API keys
        const response = await fetch(file.url);
        const blob = await response.blob();
        const loader = new PDFLoader(blob);
        const pageLevelDocs = await loader.load();

        // vectorize and index the entire document
        const pineconeIndex = pinecone.index('quill');
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        // vectorize and tag the file with its id (namespace)
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        // change file status
        await db.file.update({
          data: {
            uploadStatus: 'SUCCESS',
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (err) {
        // something went wrong during upload
        await db.file.update({
          data: {
            uploadStatus: 'FAILED',
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
