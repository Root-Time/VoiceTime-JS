import * as events from "./events";
import * as commands from "./commands";
import { Client } from "discord.js";

export function loadEvents(client: Client) {
    for (const event of Object.values<any>(events)) {
        if (!event.once) {
            client.on(event.name, (...args) => event.execute(...args));
            continue;
        }
        client.once(event.name, (...args) => event.execute(...args));
    }
}
