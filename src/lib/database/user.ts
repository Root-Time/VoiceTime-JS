import { prisma } from "./base";

export default {
  create,
  exists,
};

/**
 * create user in database
 * @param id discord user id
 * @returns created db user
 */
async function create(id: string) {
  // check if the user exists
  const userExists = !!(await prisma.user.findFirst({
    where: {
      id: id,
    },
  }));

  // return if the user exists
  if (userExists) return;

  const user = await prisma.user.create({
    data: {
      id: id,
    },
  });

  return user;
}

/**
 * returns if the user exists
 * @param id discord user id
 * @returns Boolean if user exists
 */
async function exists(id: string) {
  const userExists = !!(await prisma.user.findFirst({
    where: {
      id: id,
    },
  }));

  return userExists;
}
