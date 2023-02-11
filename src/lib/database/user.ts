import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
    create,
};

async function create(id: string) {
    const user = await prisma.user.create({
        data: {
            id: id,
        },
    });
    
    return user
}
