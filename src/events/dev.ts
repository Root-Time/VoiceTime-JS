import {
  CategoryChannel,
  ChannelType,
  Collection,
  Events,
  Message,
} from "discord.js";

module.exports = {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (message.content != "DELETE") {
      return;
    }
    const client = message.client;

    const guild = message.guild;

    let category: CategoryChannel;

    guild?.channels.cache.forEach((channel) => {
      if (
        channel.type == ChannelType.GuildCategory &&
        channel.name == "Main-testing"
      )
        category = channel;
    });

    category!.children.cache.forEach(async (channel) => {
      if (channel.name == "# Time" || channel.name == "Privat HiddenStorm")
        await channel.delete();
    });

    // const guild = message.guild;

    // const categoryChannels = guild.channels.filter((channel: any) => channel.type === "category");

    // categoryChannels.forEach((channel: any) => {
    //     console.log(`Category ${channel.name} has ${channel.children.size} channels`);
    // });
  },
};
