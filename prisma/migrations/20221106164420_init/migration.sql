-- CreateTable
CREATE TABLE "flashLoan" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "other_assets" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "chainName" TEXT NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "txHash" TEXT NOT NULL,
    "forta_source" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flashLoan_pkey" PRIMARY KEY ("id")
);
