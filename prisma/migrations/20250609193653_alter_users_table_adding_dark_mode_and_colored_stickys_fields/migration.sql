-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT,
    "is_dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "is_stickys_colored" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_users" ("email", "id", "name", "picture") SELECT "email", "id", "name", "picture" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
