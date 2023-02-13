import { database, prisma } from "./base";

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

  getHistory,
  getHistoryElement,
  getHistoryMessage,
};

/**
 * create a new Voicechannel in database
 * @param data needed to create a database voicechannel
 * @returns created db vc
 */
async function create(data: {
  voiceid: string;
  ownerid: string;
  guildid: string;
  priavte?: Boolean;
}) {
  await database.user.create(data.ownerid);

  const vc = await prisma.vc.create({
    data: {
      id: data.voiceid,
      userid: data.ownerid,
      guildid: data.guildid,
      history: "",
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

/**
 * deletes all entries of the voicechannel
 * including vcmember and vc
 * @param voiceid Voicechannel id
 */
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

/**
 * change the owner of voicechannel in the database
 * @param voiceid Voicechannel id
 * @param newOwner the new user id of the Voicechannel
 */
async function changeOwner(voiceid: string, newOwner: string) {}

async function getOwner(voiceid: string) {
  const vc = await prisma.vc.findFirst({
    where: {
      id: voiceid,
    },
  });

  if (!vc) return;

  return vc.userid;
}

/**
 * add a member to the voicechannel in the database
 * @param voiceid Voicechannel id
 * @param memberid the id of the member to add to
 * @returns
 */
async function addMember(voiceid: string, memberid: string) {
  await database.user.create(memberid);

  const vc = await prisma.vcmember.create({
    data: {
      userid: memberid,
      vcid: voiceid,
    },
  });

  return vc;
}

/**
 * return a list of member of the voicechannel
 * @param voiceid Voicechannel id
 * @returns list of member
 */
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

/**
 * checks if the voicechannel exists in the database
 * @param voiceid Voicechannel id
 * @returns Boolean if the voicechannel exists
 */
async function exist(voiceid: string): Promise<boolean> {
  const vcExists = !!(await prisma.vc.findFirst({
    where: {
      id: voiceid,
    },
  }));

  // return if the user exists
  return vcExists;
}
async function getHistory(voiceid: string) {
  const result = await prisma.vc.findUnique({
    where: {
      id: voiceid,
    },
  });

  return result?.history;
}

async function getHistoryMessage(voiceid: string) {
  return await getHistoryElement(voiceid, 0);
}

async function getHistoryElement(voiceid: string, element: number) {
  const history = await getHistory(voiceid);

  const items = history?.split(":") || [];

  let shortCounter = 0;
  let counter = 0;

  for (const item of items) {
    if (item == ":") {
      shortCounter += 1;
      continue;
    }

    shortCounter = 0;
    counter + 1;

    if (counter != element) continue;

    return {
      item: item,
      type: shortCounter,
    };
  }
}

/**
 * @returns a list of all voicechannels in the database
 */
async function all() {
  const voices = await prisma.vc.findMany({});

  return voices.map((voice) => voice.id);
}
