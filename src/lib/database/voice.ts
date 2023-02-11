import { PrismaClient } from "@prisma/client";
import { database } from "./base";
import user from "./user";

const prisma = new PrismaClient();

async function create(data: {
    voiceid: string;
    ownerid: string;
    guildid: string;
    priavte?: Boolean;
}) {
    const userExists = !!await prisma.user.findFirst({
        where: {
            id: data.ownerid
        }
    })

    if (!userExists) {
    await database.user.create(data.ownerid)
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

    return vc
}

async function remove(voiceid: string) {
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

async function changeOwner() {}

async function getOwner(voiceid: string) {
    const vc = await prisma.vc.findFirst({
        where: {
            id: voiceid,
        },
    });

    if (!vc) return false;

    return vc.userid;
}

async function addMember(voiceid: string, memberid: string) {
    const vc = await prisma.vcmember.create({
        data: {
            userid: memberid,
            vcid: voiceid,
        },
    });

    console.log(vc);
}

async function getMembers(voiceid: string) {
    const result = await prisma.vcmember.findMany({
        where: {
            vcid: voiceid,
        },
    });

    console.log(result);
    return result;
}

async function exist(vcID: string): Promise<boolean> {
    return true;
}

export default {
    create,
    remove,
    getMembers,
    addMember,
    changeOwner,
    getOwner,
    exist,
};
