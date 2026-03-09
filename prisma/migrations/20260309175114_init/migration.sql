-- CreateTable
CREATE TABLE "Order" (
    "orderId" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "creationDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "Item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("orderId") ON DELETE CASCADE ON UPDATE CASCADE
);
