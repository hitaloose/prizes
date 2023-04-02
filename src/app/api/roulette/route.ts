import { controllerErrorHandler } from "@/error/controller-error-handler";
import { HTTPError } from "@/error/http-error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { rouletteBodySchemaValidator } from "@/validators/roulette-body-schema-validator";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const user = await authMiddleware(request);

    const body = rouletteBodySchemaValidator.parse(await request.json());

    const createdRoulette = await prisma.roulette.create({
      data: { costumer_name: body.costumer_name, user_id: user.id },
    });

    return NextResponse.json({ roulette: createdRoulette }, { status: 201 });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}

export async function GET(request: Request) {
  try {
    const user = await authMiddleware(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const roulette = await prisma.roulette.findFirst({
        where: { id, user_id: user.id },
        include: { product: true },
      });

      if (!roulette) {
        throw new HTTPError("roulette not found", 404);
      }

      return NextResponse.json({ roulette });
    }

    const roulettes = await prisma.roulette.findMany({
      where: { user_id: user.id },
      include: { product: true },
    });

    return NextResponse.json({ roulettes });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await authMiddleware(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      throw new HTTPError("id query params is not provided");
    }

    const roulette = await prisma.roulette.findFirst({
      where: { id, user_id: user.id },
    });

    if (!roulette) {
      throw new HTTPError("roulette not found", 404);
    }

    await prisma.roulette.delete({ where: { id } });

    return new Response(null, { status: 204 });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}
