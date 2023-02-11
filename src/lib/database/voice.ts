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
  const userExists = !!(await prisma.user.findFirst({
    where: {
      id: data.ownerid,
    },
  }));

  if (!userExists) {
    await database.user.create(data.ownerid);
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
            userid: data.ownerid,
          },
        ],
      },
    },
  });

  return vc;
}

async function remove(voiceid: string) {
  await prisma.vcmember.deleteMany({
    where: {
      vcid: voiceid,
    },
  });

  await prisma.vc.delete({
    where: {
      id: voiceid,
    },
  });
}

async function changeOwner() {}

async function getOwner(voiceid: string) {
  const vc = await prisma.vc.findFirst({
    where: {
      id: voiceid,
    },
  });

  if (!vc) return;

  return vc.userid;
}

async function addMember(voiceid: string, memberid: string) {
  const vc = await prisma.vcmember.create({
    data: {
      userid: memberid,
      vcid: voiceid,
    },
  });

  return vc;
}

async function getMembers(voiceid: string) {
  const result = await prisma.vcmember.findMany({
    where: {
      vcid: voiceid,
    },
  });

  return result.map((result) => result.userid);
}

async function getGuild(voiceid: string) {
  const result = await prisma.vc.findUnique({
    where: {
      id: voiceid,
    },
  });

  return result?.guildid;
}

async function getPrivat(voiceid: string) {
  const result = await prisma.vc.findUnique({
    where: {
      id: voiceid,
    },
  });

  return result?.private;
}

async function exist(vcID: string): Promise<boolean> {
  return true;
}

async function all() {
  const voices = await prisma.vc.findMany({});

  return voices.map((voice) => voice.id);
}

export default {
  create,
  remove,
  getMembers,
  getGuild,
  getPrivat,
  addMember,
  changeOwner,
  getOwner,
  exist,
  all,
};
