import { ChannelType, Guild } from "discord.js";
import { database } from "../database";

export default {
  category,
};

async function category(guild: Guild) {
  const categoryId = await database.guild.category(guild.id);

  if (!categoryId) {
    console.error(`${guild.name} hat keine category channel in DB`);
    return;
  }

  const category = guild.channels.cache.get(categoryId);

  if (!category) {
    console.error(
      `${guild.name} category channel wurde wahrscheinlich gel;scht`
    );
    return;
  }

  if (category?.type != ChannelType.GuildCategory) return;

  return category;
}

async function log(guild: Guild) {
  const logId = await database.guild.log(guild.id);

  if (!logId) {
    console.error(`${guild.name} hat keine log channel`);
    return;
  }

  const log = guild.channels.cache.get(logId);

  if (log?.type != ChannelType.GuildText) return;

  return log;
}

async function normal(guild: Guild) {
  const normalId = await database.guild.normal(guild.id);

  if (!normalId) {
    console.error(`${guild.name} hat keine normal channel`);
    return;
  }

  const normal = guild.channels.cache.get(normalId);

  if (normal?.type != ChannelType.GuildVoice) return;

  return normal;
}

async function privat(guild: Guild) {
  const privatId = await database.guild.privat(guild.id);

  if (!privatId) {
    console.error(`${guild.name} hat keine privater channel`);
    return;
  }

  const privat = guild.channels.cache.get(privatId);

  if (privat?.type != ChannelType.GuildVoice) return;

  return privat;
}
