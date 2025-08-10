-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "isDatabase" BOOLEAN NOT NULL DEFAULT false,
    "parentPageId" INTEGER,
    "workspaceId" INTEGER NOT NULL,
    "emoji" TEXT,
    "publicUrl" TEXT NOT NULL DEFAULT '',
    "sortPosition" INTEGER NOT NULL DEFAULT 0,
    "inTrash" BOOLEAN DEFAULT false,
    "inPublished" BOOLEAN DEFAULT false,
    "ownerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Page_parentPageId_fkey" FOREIGN KEY ("parentPageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Page_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Page_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Page" ("createdAt", "emoji", "id", "inPublished", "inTrash", "isDatabase", "ownerId", "parentPageId", "sortPosition", "title", "updatedAt", "workspaceId") SELECT "createdAt", "emoji", "id", "inPublished", "inTrash", "isDatabase", "ownerId", "parentPageId", "sortPosition", "title", "updatedAt", "workspaceId" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
