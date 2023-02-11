import {
    CategoryChannel,
    ChannelType,
    Events,
    GuildMember,
    VoiceChannel,
    VoiceState,
} from "discord.js";
import CONFIG from "../utils/config";
import { client } from "../bot";
import { database } from "../lib/database";

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

        now.member.voice.setChannel(channel);

        await deleteChannel(channel);
    },
};

async function createNormalTalk(member: GuildMember) {
    const categoryChannel: CategoryChannel = client.channels.cache.get(
        CONFIG.category
    ) as any as CategoryChannel;

    // categoryChannel.type = ChannelType.GuildCategory
    // if (!categoryChannel || categoryChannel.type != ChannelType.GuildCategory) {
    //     return;
    // }
    // const channels = categoryChannel.type as ChannelType.GuildCategory
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

    // await database.voice.addMember(channel.id, member.id);
    return channel;
}

async function createPrivatTalk(member: GuildMember) {
    const categoryChannel = client.channels.cache.get(
        CONFIG.category
    ) as any as CategoryChannel;

    // if (!categoryChannel || categoryChannel.type != ChannelType.GuildCategory) {
    //     return;
    // }

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
    return channel;
}

async function deleteChannel(channel: VoiceChannel) {
    client.on(Events.VoiceStateUpdate, async function _() {
        if (!channel.members.size) {
            if (!channel.id) return;
            await channel.delete();
            await database.voice.remove(channel.id);
            client.removeListener(Events.VoiceStateUpdate, _);
        }
    });
}

async function createPrivateCheck(channel: VoiceChannel) {
    client.on(
        Events.VoiceStateUpdate,
        async function _(before: VoiceState, now: VoiceState) {
            if (!now.channel || !now.member || channel.id != now.channelId)
                return;
            if (!channel) {
                client.removeListener(Events.VoiceStateUpdate, _);
                return;
            }

            //todo
            console.log(database.voice.getMembers(channel.id));

            if (![""].includes(now.member.id)) {
                now.member.voice.setChannel(null);
            }
        }
    );
}
