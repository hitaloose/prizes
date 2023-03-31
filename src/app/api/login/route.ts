import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { NextResponse } from "next/server";

import { HTTPError } from "@/error/http-error";
import { apiErrorHandler } from "@/error/api-error-handler";
import { loginBodySchemaValidator } from "@/validators/login-body-schema-validation";
import { constants } from "../constants";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = loginBodySchemaValidator.parse(await request.json());

    const user = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user) {
      throw new HTTPError("user not found", 422);
    }

    const valid_password = await bcrypt.compare(
      body.password,
      user.hashed_password!
    );

    if (!valid_password) {
      throw new HTTPError("invalid password", 422);
    }

    const jwt = jsonwebtoken.sign({ id: user.id }, constants.jwtSecret);

    return NextResponse.json({
      jwt,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
