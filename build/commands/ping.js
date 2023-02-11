"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {
        return interaction.reply("Pong!");
    },
};
