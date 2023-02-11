import { CategoryChannel, ChannelType, Client, Events } from "discord.js";
import { database } from "../lib/database";
import {
  createNormalTalk,
  createPrivateCheck,
  createPrivatTalk,
  deleteChannel,
} from "../lib/discord/voice";
import { centerString } from "../utils/functions";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`>> ${centerString("Akame AI", 12)} <<`);
    console.log(`>  ${centerString("Bot by Time", 12)}  <`);
    await reviveChannel(client);
    // console.log(await database.voice.all());
  },
};

async function reviveChannel(client: Client) {
  const voicesId = await database.voice.all();

  voicesId.forEach(async (voiceId) => {
    const guildId = await database.voice.getGuild(voiceId);
    const guild = client.guilds.cache.get(guildId!);

    const channel = guild?.channels.cache.get(voiceId);

    if (!channel || channel.type != ChannelType.GuildVoice) {
      await database.voice.remove(voiceId);
      return;
    }

    const privat = await database.voice.getPrivat(channel.id);

    if (privat) createPrivateCheck(channel);

    if (!channel.members.size) {
      if (!channel.id) return;
      if (channel.guild.channels.cache.has(channel.id)) await channel.delete();
      await database.voice.remove(channel.id);
      return;
    }
    await deleteChannel(channel);

    // const membersId = await database.voice.getMembers(voiceId);
    // const ownerId = await database.voice.getOwner(voiceId);

    // await database.voice.remove(voiceId);

    // const owner = guild!.members.cache.get(ownerId!);

    // if (privat) {
    //   return await createPrivatTalk(owner!);
    // }
    // await createNormalTalk(owner!);
  });
}
