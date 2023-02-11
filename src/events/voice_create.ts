import {
  CategoryChannel,
  ChannelType,
  Events,
  Guild,
  GuildMember,
  VoiceChannel,
  VoiceState,
} from "discord.js";
import CONFIG from "../utils/config";
import { client } from "../bot";
import { database } from "../lib/database";
import guild from "../lib/database/guild";
import { createNormalTalk, createPrivatTalk } from "../lib/discord/voice";

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(_: VoiceState, now: VoiceState) {
    if (
      !now.member ||
      !now.channelId ||
      ![CONFIG.normal, CONFIG.privat].includes(now.channelId)
    )
      return;

    const channel =
      now.channelId == CONFIG.normal
        ? await createNormalTalk(now.member)
        : await createPrivatTalk(now.member);
  },
};
