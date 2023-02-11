"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: discord_js_1.Events.MessageCreate,
    async execute(message) {
        return;
        const guild = message.guild;
        const categoryChannels = guild.channels.filter((channel) => channel.type === "category");
        categoryChannels.forEach((channel) => {
            console.log(`Category ${channel.name} has ${channel.children.size} channels`);
        });
    }
};
