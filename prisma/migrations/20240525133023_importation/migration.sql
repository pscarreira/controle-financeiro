-- CreateTable
CREATE TABLE "Importation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactions_date" DATETIME NOT NULL
);