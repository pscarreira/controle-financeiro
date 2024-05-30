-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "origin_bank" TEXT NOT NULL,
    "origin_branch" TEXT NOT NULL,
    "origin_account" TEXT NOT NULL,
    "destination_bank" TEXT NOT NULL,
    "destination_branch" TEXT NOT NULL,
    "destination_account" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "importationId" INTEGER,
    CONSTRAINT "FinancialTransaction_importationId_fkey" FOREIGN KEY ("importationId") REFERENCES "Importation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FinancialTransaction" ("amount", "date", "destination_account", "destination_bank", "destination_branch", "id", "origin_account", "origin_bank", "origin_branch") SELECT "amount", "date", "destination_account", "destination_bank", "destination_branch", "id", "origin_account", "origin_bank", "origin_branch" FROM "FinancialTransaction";
DROP TABLE "FinancialTransaction";
ALTER TABLE "new_FinancialTransaction" RENAME TO "FinancialTransaction";
PRAGMA foreign_key_check("FinancialTransaction");
PRAGMA foreign_keys=ON;
