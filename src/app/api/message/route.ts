import { db } from '@/db';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return new Response('User not found', { status: 404 });

    const { id: userId } = user;
    if (!userId) return new Response('Unauthorized', { status: 401 });

    // ask a question to a PDF file
    const body = await req.json();
    const { fileId, message } = SendMessageValidator.parse(body);
    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId,
        },
    });
    if (!file) return new Response('File not found', { status: 404 });

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId,
        },
    });

    //
}
