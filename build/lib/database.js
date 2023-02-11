"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDatabase = exports.createNewTable = exports.queryDatabase = void 0;
const sqlite3_1 = require("sqlite3");
const database_1 = require("../database");
const sqlite = (0, sqlite3_1.verbose)();
async function queryDatabase(sql) {
    database_1.database.run(sql, (err) => {
        if (err) {
            console.log(`\n${sql}:\n => ${err}`);
        }
    });
}
exports.queryDatabase = queryDatabase;
async function createNewTable(name, columns) {
    const columnSql = columns
        .map((column) => {
        return `${column} TEXT`;
    })
        .join(", ");
    await queryDatabase(`CREATE TABLE ${name} (${columnSql})`);
}
exports.createNewTable = createNewTable;
function openDatabase() {
    return new sqlite.Database("./src/data.db", sqlite.OPEN_READWRITE, (err) => {
        if (err)
            return console.log(err.message);
        console.log("Database connected succesful!");
    });
}
exports.openDatabase = openDatabase;
