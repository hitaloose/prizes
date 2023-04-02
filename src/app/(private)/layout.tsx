"use client";

import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { push } = useRouter();
  const { authenticated, changeJwt } = useAuth();

  const handleExitClick = useCallback(() => {
    changeJwt("");
    push("/logon");
  }, [changeJwt, push]);

  useEffect(() => {
    if (!authenticated) {
      push("/logon");
    }
  }, [authenticated, push]);

  return (
    <div className="flex h-full">
      <nav className="bg-gray-200 m-2 p-2 rounded flex flex-col justify-between">
        <ul className="flex flex-col gap-4 w-48">
          <li>
            <Link href="/product">Produtos</Link>
          </li>
          <li>
            <Link href="/roulette">Roletas</Link>
          </li>
        </ul>

        <Button onClick={handleExitClick}>Sair</Button>
      </nav>

      <div className="m-2 p-2 w-full h-full">{children}</div>
    </div>
  );
}
