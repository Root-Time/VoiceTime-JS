import { Client as RootClient, Events, ClientOptions } from "discord.js";
import { loadEvents } from "./handler";
import { config } from "dotenv";

export const client = new RootClient({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildVoiceStates"],
});

config();

class Client extends RootClient {
    constructor(options: ClientOptions) {
        super(options);
    }
    normal = "1066516765481386017";
    privat = "1066516878601769000";
    manager = "1066517070612803674";
    log = "1066517369326948533";
    category = "1066437782458863747";
}

loadEvents(client);

client.login(process.env.TOKEN);
