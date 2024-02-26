import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { notFound, redirect } from "next/navigation";

type FileIdProps = {
  params: {
    fileId: string;
  };
};

export default async function FileId({ params }: FileIdProps) {
  // retrive the file id
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  // make db call to get all the details
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return <div>{fileId}</div>;
}
