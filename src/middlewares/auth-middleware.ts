import jsonwebtoken from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

import { HTTPError } from "@/error/http-error";
import { constants } from "@/app/api/constants";

const prisma = new PrismaClient();

export const authMiddleware = async (request: Request): Promise<User> => {
  const bearerToken = request.headers.get("authorization");

  if (!bearerToken) {
    throw new HTTPError("authorization header is not provided", 401);
  }

  const [prefix, token] = bearerToken.split(" ");

  if (!prefix || prefix.toLowerCase() !== "bearer") {
    throw new HTTPError("invalid authorization prefix", 401);
  }

  const decodedToken = jsonwebtoken.verify(token, constants.jwtSecret) as {
    id: string;
  };

  const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

  if (!user) {
    throw new HTTPError("token ower not found", 401);
  }

  return user;
};
