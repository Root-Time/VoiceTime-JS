"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const base_1 = require("./base");
const prisma = new client_1.PrismaClient();
async function create(data) {
    const userExists = !!await prisma.user.findFirst({
        where: {
            id: data.ownerid
        }
    });
    if (!userExists) {
        await base_1.database.user.create(data.ownerid);
    }
    const vc = await prisma.vc.create({
        data: {
            id: data.voiceid,
            userid: data.ownerid,
            guildid: data.guildid,
            // add owner as member to voicechannel
            vcmember: {
                create: [
                    {
                        userid: data.ownerid
                    }
                ]
            }
        },
    });
    return vc;
}
async function remove(voiceid) {
    console.log(voiceid);
    await prisma.vc.delete({
        where: {
            id: voiceid,
        },
    });
    // await prisma.vcmember.deleteMany({
    //     where: {
    //         vcid: voiceid,
    //     },
    // });
}
async function changeOwner() { }
async function getOwner(voiceid) {
    const vc = await prisma.vc.findFirst({
        where: {
            id: voiceid,
        },
    });
    if (!vc)
        return false;
    return vc.userid;
}
async function addMember(voiceid, memberid) {
    const vc = await prisma.vcmember.create({
        data: {
            userid: memberid,
            vcid: voiceid,
        },
    });
    console.log(vc);
}
async function getMembers(voiceid) {
    const result = await prisma.vcmember.findMany({
        where: {
            vcid: voiceid,
        },
    });
    console.log(result);
    return result;
}
async function exist(vcID) {
    return true;
}
exports.default = {
    create,
    remove,
    getMembers,
    addMember,
    changeOwner,
    getOwner,
    exist,
};
