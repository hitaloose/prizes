import { NextResponse } from "next/server";
import { HTTPError } from "./http-error";
import { ZodError } from "zod";

export const controllerErrorHandler = (error: unknown) => {
  if (error instanceof ZodError) {
    const { errors } = error;
    return NextResponse.json({ message: "zod error", errors }, { status: 400 });
  }
  if (error instanceof HTTPError) {
    const { message, status } = error;
    return NextResponse.json({ message }, { status });
  }

  if (error instanceof Error) {
    const { message } = error;
    return NextResponse.json({ message }, { status: 500 });
  }

  return NextResponse.json({ message: "Erro desconhecido" }, { status: 500 });
};
