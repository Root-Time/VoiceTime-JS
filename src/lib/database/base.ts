import { PrismaClient } from "@prisma/client";

import voice from "./voice";
import user from "./user";
import guild from "./guild";

export const prisma = new PrismaClient();

export const database = {
  voice,
  user,
  guild,
};
