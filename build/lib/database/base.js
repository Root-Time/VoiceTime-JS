"use strict";
// import { verbose } from "sqlite3";
// import voice from "./voice";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
// const sqlite = verbose();
// const db = open();
// async function query(sql: string) {
//     db.run(sql, (err: any) => {
//         if (err) {
//             console.log(`\n${sql}:\n => ${err}`);
//         }
//     });
// }
// async function createTable(name: string, columns: string[]) {
//     const columnSql = columns
//         .map((column) => {
//             return `${column} TEXT`;
//         })
//         .join(", ");
//     await query(`CREATE TABLE ${name} (${columnSql})`);
// }
// function open() {
//     return new sqlite.Database(
//         "./src/data.db",
//         sqlite.OPEN_READWRITE,
//         (err: any) => {
//             if (err) return console.log(err.message);
//             console.log("Database connected succesful!");
//         }
//     );
// }
const client_1 = require("@prisma/client");
const voice_1 = __importDefault(require("./voice"));
const user_1 = __importDefault(require("./user"));
const prisma = new client_1.PrismaClient();
exports.database = {
    voice: voice_1.default,
    user: user_1.default,
};
