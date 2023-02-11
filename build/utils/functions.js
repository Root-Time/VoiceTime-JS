"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.centerString = void 0;
function centerString(string, length) {
    return string.padStart((string.length + length) / 2).padEnd(length);
}
exports.centerString = centerString;
