import {
  GuildMember,
  CategoryChannel,
  ChannelType,
  VoiceChannel,
  Events,
  VoiceState,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import { client } from "../../bot";
import CONFIG from "../../utils/config";
import { database } from "../database";

export async function createNormalTalk(member: GuildMember) {
  const categoryChannel: CategoryChannel = client.channels.cache.get(
    CONFIG.category
  ) as any as CategoryChannel;

  const channel = await member.guild.channels.create({
    name: `${CONFIG.prefixNormal} ${member.user.username}`,
    parent: categoryChannel,
    type: ChannelType.GuildVoice,
  });

  await database.voice.create({
    voiceid: channel.id,
    guildid: member.guild.id,
    ownerid: member.id,
    priavte: false,
  });

  member.voice.setChannel(channel);

  await deleteChannel(channel);
  // await database.voice.addMember(channel.id, member.id);
}

export async function createPrivatTalk(member: GuildMember) {
  const categoryChannel = client.channels.cache.get(
    CONFIG.category
  ) as any as CategoryChannel;

  const channel = await member.guild.channels.create({
    name: `${CONFIG.prefixPrivat} ${member.user.username}`,
    parent: categoryChannel,
    type: ChannelType.GuildVoice,
  });
  await database.voice.create({
    guildid: member.guild.id,
    ownerid: member.id,
    voiceid: channel.id,
    priavte: true,
  });

  createPrivateCheck(channel);

  member.voice.setChannel(channel);

  await deleteChannel(channel);

  return channel;
}

export async function deleteChannel(channel: VoiceChannel) {
  client.on(Events.VoiceStateUpdate, async function _() {
    if (!channel.members.size) {
      if (!channel.id) return;
      client.removeListener(Events.VoiceStateUpdate, _);
      if (channel.guild.channels.cache.has(channel.id)) await channel.delete();
      await database.voice.remove(channel.id);
    }
  });
}

export async function createPrivateCheck(channel: VoiceChannel) {
  client.on(
    Events.VoiceStateUpdate,
    async function _(before: VoiceState, now: VoiceState) {
      if (!now.channel || !now.member || channel.id != now.channelId) return;
      if (!channel) {
        client.removeListener(Events.VoiceStateUpdate, _);
        return;
      }

      //todo
      const members = await database.voice.getMembers(channel.id);

      if (!members.includes(now.member.id)) {
        await sendAllowMessage(channel, now.member);
        await now.member.voice.setChannel(null);
      }
    }
  );
}

export async function sendAllowMessage(
  channel: VoiceChannel,
  member: GuildMember
) {
  const guild = channel.guild;
  const owner = await database.voice.getOwner(channel.id);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("primary")
      .setLabel("Accept")
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({
    content: `Darf ${member.displayName} beitreten?`,
    components: [row],
  });

  client.on(Events.InteractionCreate, async (_) => {
    // TODO HIER WIETER MACHEN
  });
}
