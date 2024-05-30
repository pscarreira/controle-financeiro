-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Importation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactions_date" DATETIME NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Importation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Importation" ("created_at", "id", "transactions_date") SELECT "created_at", "id", "transactions_date" FROM "Importation";
DROP TABLE "Importation";
ALTER TABLE "new_Importation" RENAME TO "Importation";
PRAGMA foreign_key_check("Importation");
PRAGMA foreign_keys=ON;
