"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const discord_js_1 = require("discord.js");
const handler_1 = require("./handler");
const dotenv_1 = require("dotenv");
exports.client = new discord_js_1.Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildVoiceStates"],
});
(0, dotenv_1.config)();
class Client extends discord_js_1.Client {
    constructor(options) {
        super(options);
    }
    normal = "1066516765481386017";
    privat = "1066516878601769000";
    manager = "1066517070612803674";
    log = "1066517369326948533";
    category = "1066437782458863747";
}
(0, handler_1.loadEvents)(exports.client);
exports.client.login(process.env.TOKEN);
