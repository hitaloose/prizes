"use client";

import { FormEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Link } from "@/components/link";
import { useAuth } from "@/hooks/auth";

export default function Page() {
  const { push } = useRouter();
  const { changeJwt } = useAuth();

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setUsernameError("");
      setPasswordError("");

      if (!username) {
        setUsernameError("Nome de usuário é obrigatorio");
      }

      if (!password) {
        setPasswordError("Senha é obrigatorio");
      }

      if (!username || !password) {
        return;
      }

      setLoading(true);
      try {
        const { data } = await axios.post("/api/login", { username, password });

        changeJwt(data.jwt);
        push("/home");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
          return;
        }

        toast.error("Ocorreu um erro desconhecido");
      } finally {
        setLoading(false);
      }
    },
    [password, username, changeJwt, push]
  );

  return (
    <>
      {loading && (
        <div className="z-10 absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-40" />
      )}
      <div className="flex justify-center items-center w-full h-full">
        <div className="max-w-md">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4 max-w-[351px]">
              <h1 className="text-gray-800 text-4xl font-bold">
                Acesse a plataforma
              </h1>
            </div>

            <form
              className="flex flex-col gap-8"
              action="submit"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-4">
                <Input
                  label="Usuário"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChange={setUsername}
                  error={usernameError}
                />
                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  error={passwordError}
                />
              </div>

              <Button>Entrar</Button>

              <span className="text-gray-600 text-base font-normal">
                Ainda não tem conta? <Link href="/logon">Inscreva-se</Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
