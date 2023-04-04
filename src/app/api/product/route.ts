import { controllerErrorHandler } from "@/error/controller-error-handler";
import { HTTPError } from "@/error/http-error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { productBodySchemaValidator } from "@/validators/product-body-schema-validator";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const user = await authMiddleware(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await prisma.product.findFirst({
        where: { id, user_id: user.id },
      });

      if (!product) {
        throw new HTTPError("product not found", 404);
      }

      return NextResponse.json({ product });
    }

    const products = await prisma.product.findMany({
      where: { user_id: user.id },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await authMiddleware(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      throw new HTTPError("id query params is not provided");
    }

    const product = await prisma.product.findFirst({
      where: { id, user_id: user.id },
    });
    if (!product) {
      throw new HTTPError("product not found", 404);
    }

    const body = productBodySchemaValidator.parse(await request.json());

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        stock: body.stock,
      },
    });

    return NextResponse.json({ product: updatedProduct });
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

    const product = await prisma.product.findFirst({
      where: { id, user_id: user.id },
    });
    if (!product) {
      throw new HTTPError("product not found", 404);
    }

    await prisma.product.delete({ where: { id } });

    return new Response(null, { status: 204 });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await authMiddleware(request);

    const body = productBodySchemaValidator.parse(await request.json());

    const product = await prisma.product.create({
      data: { name: body.name, stock: body.stock, user_id: user.id },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}
