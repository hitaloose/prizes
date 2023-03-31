import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { HTTPError } from "@/error/http-error";
import { controllerErrorHandler } from "@/error/controller-error-handler";
import { prizeBodySchemaValidator } from "@/validators/prize-body-schema-validator";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      throw new HTTPError("id query params is not provided");
    }

    const roulette = await prisma.roulette.findUnique({ where: { id } });

    if (!roulette) {
      throw new HTTPError("roulette not found");
    }

    const products = await prisma.product.findMany({
      where: { user_id: roulette.user_id },
    });

    return NextResponse.json({ roulette, products });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      throw new HTTPError("id query params is not provided");
    }

    const roulette = await prisma.roulette.findUnique({ where: { id } });

    if (!roulette) {
      throw new HTTPError("roulette not found");
    }

    const body = prizeBodySchemaValidator.parse(await request.json());

    const updatedRoulette = await prisma.roulette.update({
      where: { id },
      data: {
        product_prizeed_id: body.product_prizeed_id,
        prize_date: new Date(),
      },
    });

    return NextResponse.json({ roulette: updatedRoulette });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}
