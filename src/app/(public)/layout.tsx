"use client";

import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  const { authenticated } = useAuth();

  useEffect(() => {
    if (authenticated) {
      push("/home");
    }
  }, [authenticated, push]);

  return <>{children}</>;
}
