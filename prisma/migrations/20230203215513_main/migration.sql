/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vc" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT NOT NULL,
    "guildid" TEXT NOT NULL,
    "private" BOOLEAN,
    CONSTRAINT "vc_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_vc" ("guildid", "id", "private", "userid") SELECT "guildid", "id", "private", "userid" FROM "vc";
DROP TABLE "vc";
ALTER TABLE "new_vc" RENAME TO "vc";
CREATE UNIQUE INDEX "vc_id_key" ON "vc"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
