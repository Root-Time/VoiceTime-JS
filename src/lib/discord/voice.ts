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
  Interaction,
  ComponentType,
  PermissionOverwriteManager,
  OverwriteType,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js";
import { client } from "../../bot";
import CONFIG from "../../utils/config";
import { database } from "../database";

/**
 * creates a temporary normal voicechannel
 * @param member the owner that creates the voicechannel
 * @returns oicechannel
 */
export async function createNormalTalk(member: GuildMember) {
  // TODO change to guild
  const categoryChannel = client.channels.cache.get(CONFIG.category);

  if (categoryChannel?.type != ChannelType.GuildCategory) return;

  // creates the actual Voicechannel
  const channel = await member.guild.channels.create({
    name: `${CONFIG.prefixNormal} ${member.user.username}`,
    parent: categoryChannel,
    type: ChannelType.GuildVoice,
    permissionOverwrites: [
      {
        id: member.id,
        allow: [PermissionsBitField.Flags.ManageChannels],
      },
    ],
  });

  // save the voicehchannel to the database
  // add owner to the memberlist
  await database.voice.create({
    voiceid: channel.id,
    guildid: member.guild.id,
    ownerid: member.id,
    priavte: false,
  });

  await createNormalCheck(channel);
  // move owner to the create
  member.voice.setChannel(channel);

  // delete channel if the channel is empty
  await deleteChannel(channel);

  return channel;
}

/**
 * creates a temporary private voicechannel
 * @param member the owner that created the channel
 * @returns voicechannel
 */
export async function createPrivatTalk(member: GuildMember) {
  //TODO change to guild
  const categoryChannel = client.channels.cache.get(CONFIG.category);

  if (categoryChannel?.type != ChannelType.GuildCategory) return;

  // create the actual Channel
  const channel = await member.guild.channels.create({
    name: `${CONFIG.prefixPrivat} ${member.user.username}`,
    parent: categoryChannel,
    type: ChannelType.GuildVoice,
  });

  // add the channel to database
  await database.voice.create({
    guildid: member.guild.id,
    ownerid: member.id,
    voiceid: channel.id,
    priavte: true,
  });

  // Handler if someone can join the voicechannel
  createPrivateCheck(channel);

  // move the owner the created channel
  member.voice.setChannel(channel);

  // delete channel if empty
  await deleteChannel(channel);

  return channel;
}

/**
 * check if the Voicechannel is empty. \
 * if yes the gets deleted and the entries in the database
 * @param channel VoiceChannel to check
 */
export async function deleteChannel(channel: VoiceChannel) {
  // temporary listener
  client.on(Events.VoiceStateUpdate, async function _() {
    // channel empty?
    if (!channel.members.size) {
      // channel exists (Check1)
      if (!channel.id) return;
      // remove temporary listener
      client.removeListener(Events.VoiceStateUpdate, _);
      // delete the channel if the channel exists (Check2)
      if (channel.guild.channels.cache.has(channel.id)) await channel.delete();
      // delete Channel from database
      await database.voice.remove(channel.id);
    }
  });
}

export async function createNormalCheck(channel: VoiceChannel) {
  client.on(
    Events.VoiceStateUpdate,
    async function _(before: VoiceState, now: VoiceState) {
      const member = now.member;

      if (
        !member ||
        (channel.id != now.channelId && channel.id != before.channelId)
      )
        return;
      if (!channel) {
        client.removeListener(Events.VoiceStateUpdate, _);
        return;
      }

      const join = now.channel == channel;

      await updateJoinLeaveMessage(channel, member, join);
    }
  );
}

export async function createPrivateCheck(channel: VoiceChannel) {
  client.on(
    Events.VoiceStateUpdate,
    async function _(before: VoiceState, now: VoiceState) {
      const member = now.member;
      if (!now.channel || !member || channel.id != now.channelId) return;
      if (!channel) {
        client.removeListener(Events.VoiceStateUpdate, _);
        return;
      }

      //todo friends
      const members = await database.voice.getMembers(channel.id);

      if (!members.includes(member.id)) {
        await channel.permissionOverwrites.edit(member, {
          Connect: false,
          SendMessages: false,
        });

        await sendAllowMessage(channel, member);
        await member.voice.setChannel(null);
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

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("primary")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("secondary")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Secondary)
    );

  const message = await channel.send({
    content: `Darf ${member.displayName} beitreten?`,
    components: [row],
  });

  const filter = (i: Interaction) => i.isButton() && i.message == message;

  const collector = channel.createMessageComponentCollector({
    filter,
    time: 15000,
    componentType: ComponentType.Button,
  });

  collector.on("collect", async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.message != message) return;

    if (interaction.customId == "primary") {
      if (interaction.member?.user.id != owner) {
        interaction.reply({
          content: "Du bist nicht erlaubt diesen Knopf zu druecken!",
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: "Erfolgreich ihm erlaubt beizutreten!",
        ephemeral: true,
      });
      await interaction.message.delete();
      await database.voice.addMember(channel.id, member.id);
      collector.stop("ACCESS");
      return;
    }

    if (interaction.member?.user.id == member.id) {
      await interaction.reply({
        content:
          "Indem du auf Delcine gedrueckt hast, hast du die Anfrage abgebrochen!",
        ephemeral: true,
      });
      await interaction.message.delete();
      return;
    }

    if (interaction.member?.user.id != owner) {
      await interaction.reply(
        "Du bist nicht erlaubt diesen Knopf zu druecken!"
      );
      return;
    }

    await interaction.reply({
      content: `Du ${member.user.username} hast erfolgreich abgelehnt!`,
      ephemeral: true,
    });
    await interaction.message.delete();
    collector.stop("DECLINE");
  });

  collector.on("end", async (_, reason) => {
    if (reason == "DECLINE") return;

    await channel.permissionOverwrites.edit(member, {
      Connect: true,
      SendMessages: true,
    });
  });
}

async function textChannel(channel: VoiceChannel, owner: GuildMember) {
  await channel.send("CREATED VOICECHANNEL");

  const message = await channel.send(`${owner.user} ist beigetreten`);

  client.on(
    Events.VoiceStateUpdate,
    async function _(before: VoiceState, now: VoiceState) {}
  );
}

async function updateJoinLeaveMessage(
  channel: VoiceChannel,
  member: GuildMember,
  join: Boolean
) {
  // const messageId = await database.voice.getHistoryMessage(channel.id);
  // const history = await database.voice.getHistory(channel.id);

  // await database.voice.addHistory(channel.id, member, join);

  // const message = channel.messages.cache.get(messageId);

  const messageContent = `${voiceJoinDate()}\n${joinLeaveMessageString(
    member,
    join
  )}`;

  await channel.send({ content: messageContent });

  // history.forEach((member) => {
  //   messageContent += "\n";
  // });

  // if (!message) {
  // }
}

function voiceJoinDate(lastDate?: string) {
  const date = new Date();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const formatDate = `${hour}:${minute}`;

  return lastDate == formatDate ? lastDate : "";
}

// TODO add language support
function joinLeaveMessageString(member: GuildMember, join: Boolean) {
  const joinMessage = `${member.user.username} joined!`;
  const leaveMessage = `${member.user.username} leaved!`;

  return join ? joinMessage : leaveMessage;
}
