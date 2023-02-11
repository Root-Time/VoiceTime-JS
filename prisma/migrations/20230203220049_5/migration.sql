-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vcmember" (
    "vcid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    PRIMARY KEY ("vcid", "userid"),
    CONSTRAINT "vcmember_vcid_fkey" FOREIGN KEY ("vcid") REFERENCES "vc" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_vcmember" ("userid", "vcid") SELECT "userid", "vcid" FROM "vcmember";
DROP TABLE "vcmember";
ALTER TABLE "new_vcmember" RENAME TO "vcmember";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
