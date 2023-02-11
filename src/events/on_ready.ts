import { CategoryChannel, Client, Events } from "discord.js";
import { centerString } from "../utils/functions";

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log(`>> ${centerString("Akame AI", 12)} <<`);
        console.log(`>  ${centerString("Bot by Time", 12)}  <`);
    },
};
