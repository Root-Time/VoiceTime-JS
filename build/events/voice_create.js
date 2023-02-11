"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../utils/config"));
const bot_1 = require("../bot");
const database_1 = require("../lib/database");
module.exports = {
    name: discord_js_1.Events.VoiceStateUpdate,
    async execute(_, now) {
        if (!now.member ||
            !now.channelId ||
            ![config_1.default.normal, config_1.default.privat].includes(now.channelId))
            return;
        const channel = now.channelId == config_1.default.normal
            ? await createNormalTalk(now.member)
            : await createPrivatTalk(now.member);
        now.member.voice.setChannel(channel);
        await deleteChannel(channel);
    },
};
async function createNormalTalk(member) {
    const categoryChannel = bot_1.client.channels.cache.get(config_1.default.category);
    // categoryChannel.type = ChannelType.GuildCategory
    // if (!categoryChannel || categoryChannel.type != ChannelType.GuildCategory) {
    //     return;
    // }
    // const channels = categoryChannel.type as ChannelType.GuildCategory
    const channel = await member.guild.channels.create({
        name: `${config_1.default.prefixNormal} ${member.user.username}`,
        parent: categoryChannel,
        type: discord_js_1.ChannelType.GuildVoice,
    });
    await database_1.database.voice.create({
        voiceid: channel.id,
        guildid: member.guild.id,
        ownerid: member.id,
        priavte: false,
    });
    // await database.voice.addMember(channel.id, member.id);
    return channel;
}
async function createPrivatTalk(member) {
    const categoryChannel = bot_1.client.channels.cache.get(config_1.default.category);
    // if (!categoryChannel || categoryChannel.type != ChannelType.GuildCategory) {
    //     return;
    // }
    const channel = await member.guild.channels.create({
        name: `${config_1.default.prefixPrivat} ${member.user.username}`,
        parent: categoryChannel,
        type: discord_js_1.ChannelType.GuildVoice,
    });
    await database_1.database.voice.create({
        guildid: member.guild.id,
        ownerid: member.id,
        voiceid: channel.id,
        priavte: true,
    });
    createPrivateCheck(channel);
    return channel;
}
async function deleteChannel(channel) {
    bot_1.client.on(discord_js_1.Events.VoiceStateUpdate, async function _() {
        if (!channel.members.size) {
            if (!channel.id)
                return;
            await channel.delete();
            await database_1.database.voice.remove(channel.id);
            bot_1.client.removeListener(discord_js_1.Events.VoiceStateUpdate, _);
        }
    });
}
async function createPrivateCheck(channel) {
    bot_1.client.on(discord_js_1.Events.VoiceStateUpdate, async function _(before, now) {
        if (!now.channel || !now.member || channel.id != now.channelId)
            return;
        if (!channel) {
            bot_1.client.removeListener(discord_js_1.Events.VoiceStateUpdate, _);
            return;
        }
        //todo
        console.log(database_1.database.voice.getMembers(channel.id));
        if (![""].includes(now.member.id)) {
            now.member.voice.setChannel(null);
        }
    });
}
