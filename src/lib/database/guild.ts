import { Guild } from "discord.js";
import { prisma } from "./base";

export default {
  create,
  get,
  category,
  log,
  normal,
  privat,
};

async function get(guildId: string) {
  const guild = await prisma.guild.findFirst({
    where: {
      id: guildId,
    },
  });

  return guild;
}

async function category(guildId: string) {
  const guild = await get(guildId);
  return guild?.category;
}

async function log(guildId: string) {
  const guild = await get(guildId);
  return guild?.log;
}

async function normal(guildId: string) {
  const guild = await get(guildId);
  return guild?.normal;
}

async function privat(guildId: string) {
  const guild = await get(guildId);
  return guild?.private;
}

async function create(data: {
  id: string;
  category: string;
  log: string;
  normal: string;
  private: string;
}) {
  const guild = await prisma.guild.create({
    data: {
      id: data.id,
      category: data.category,
      log: data.log,
      normal: data.normal,
      private: data.private,
    },
  });

  return guild;
}
