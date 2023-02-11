-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "vc" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT NOT NULL,
    "guildid" TEXT NOT NULL,
    "private" BOOLEAN
);

-- CreateTable
CREATE TABLE "vcmember" (
    "vcid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    PRIMARY KEY ("vcid", "userid"),
    CONSTRAINT "vcmember_vcid_fkey" FOREIGN KEY ("vcid") REFERENCES "vc" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vcmember_vcid_fkey" FOREIGN KEY ("vcid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
