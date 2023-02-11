"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const database_1 = require("./lib/database/database");
exports.database = (0, database_1.openDatabase)();
