-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "origin_bank" TEXT NOT NULL,
    "origin_branch" TEXT NOT NULL,
    "origin_account" TEXT NOT NULL,
    "destination_bank" TEXT NOT NULL,
    "destination_branch" TEXT NOT NULL,
    "destination_account" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL
);
