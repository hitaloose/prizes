import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { NextResponse } from "next/server";

import { logonBodySchemaValidator } from "@/validators/logon-body-schema-validator";
import { HTTPError } from "@/error/http-error";
import { controllerErrorHandler } from "@/error/controller-error-handler";
import { constants } from "../constants";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = logonBodySchemaValidator.parse(await request.json());

    const alreadyExists = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (alreadyExists) {
      throw new HTTPError("user already exists", 422);
    }

    const hashed_password = await bcrypt.hash(body.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        username: body.username,
        hashed_password,
      },
    });

    const jwt = jsonwebtoken.sign({ id: createdUser.id }, constants.jwtSecret);

    return NextResponse.json({
      jwt,
      user: { id: createdUser.id, username: createdUser.username },
    });
  } catch (error) {
    return controllerErrorHandler(error);
  }
}
