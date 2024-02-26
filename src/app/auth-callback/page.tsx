import { useRouter, useSearchParams } from "next/navigation";

export default async function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
}
