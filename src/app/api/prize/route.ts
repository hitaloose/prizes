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

    const roulette = await prisma.roulette.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!roulette) {
      throw new HTTPError("roulette not found");
    }

    const products = await prisma.product.findMany({
      where: { user_id: roulette.user_id, stock: { gt: 0 } },
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

    const product = await prisma.product.findFirst({
      where: {
        id: body.product_prizeed_id,
        user_id: roulette.user_id,
        stock: { gt: 0 },
      },
    });

    if (!product) {
      throw new HTTPError("product not found");
    }

    const updatedRoulette = await prisma.roulette.update({
      where: { id },
      include: { product: true },
      data: {
        product_prizeed_id: body.product_prizeed_id,
        prize_date: new Date(),
      },
    });

    await prisma.product.update({
      data: { stock: product.stock - 1 },
      where: { id: body.product_prizeed_id },
    });

    return NextResponse.json({ roulette: updatedRoulette });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}
