"use client";

import { FormEvent, useCallback, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Link } from "@/components/link";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const { changeJwt } = useAuth();
  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(""); // prettier-ignore

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setUsernameError("");
      setPasswordError("");
      setPasswordConfirmationError("");

      if (!username) {
        setUsernameError("Nome de usuário é obrigatorio");
      }

      if (!password) {
        setPasswordError("Senha é obrigatorio");
      }

      if (!passwordConfirmation) {
        setPasswordConfirmationError("Senha de confirmação é obrigatorio");
      }

      if (!username || !password || !passwordConfirmation) {
        return;
      }

      setLoading(true);

      try {
        const { data } = await axios.post("/api/logon", {
          username,
          password,
          password_confirmation: passwordConfirmation,
        });

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
    [username, password, passwordConfirmation, changeJwt, push]
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
                <Input
                  label="Senha de confirmação"
                  placeholder="Confirme sua senha"
                  type="password"
                  value={passwordConfirmation}
                  onChange={setPasswordConfirmation}
                  error={passwordConfirmationError}
                />
              </div>

              <Button>Cadastrar</Button>

              <span className="text-gray-600 text-base font-normal">
                Já tem conta? <Link href="/login">Entre</Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
