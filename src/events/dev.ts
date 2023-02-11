import { Events } from "discord.js";

module.exports = {
    name: Events.MessageCreate,
    async execute (message: any) {
        return
        const guild = message.guild;

        const categoryChannels = guild.channels.filter((channel: any) => channel.type === "category");

        categoryChannels.forEach((channel: any) => {
            console.log(`Category ${channel.name} has ${channel.children.size} channels`);
        });
    }
}