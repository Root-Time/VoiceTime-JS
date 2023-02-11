import { CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    name: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction: CommandInteraction) {
        return interaction.reply("Pong!");
    },
};
