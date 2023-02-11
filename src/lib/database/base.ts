// import { verbose } from "sqlite3";
// import voice from "./voice";

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

import { PrismaClient } from "@prisma/client";
import voice from "./voice";
import user from "./user";
const prisma = new PrismaClient();

export const database = {
    voice,
    user,
};
