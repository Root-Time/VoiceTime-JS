"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const functions_1 = require("../utils/functions");
module.exports = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`>> ${(0, functions_1.centerString)("Akame AI", 12)} <<`);
        console.log(`>  ${(0, functions_1.centerString)("Bot by Time", 12)}  <`);
    },
};
