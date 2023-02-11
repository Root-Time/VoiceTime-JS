"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = {
    create,
};
async function create(id) {
    const user = await prisma.user.create({
        data: {
            id: id,
        },
    });
    return user;
}
