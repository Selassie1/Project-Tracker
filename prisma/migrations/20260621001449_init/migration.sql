-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "amountCharged" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchProject" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "amountCharged" DOUBLE PRECISION NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "depositPaidAt" TIMESTAMP(3),
    "balanceAmount" DOUBLE PRECISION NOT NULL,
    "balancePaid" BOOLEAN NOT NULL DEFAULT false,
    "balancePaidAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareStudy" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "amountCharged" DOUBLE PRECISION NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "depositPaidAt" TIMESTAMP(3),
    "balanceAmount" DOUBLE PRECISION NOT NULL,
    "balancePaid" BOOLEAN NOT NULL DEFAULT false,
    "balancePaidAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodingProject" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "amountCharged" DOUBLE PRECISION NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "depositPaid" BOOLEAN NOT NULL DEFAULT false,
    "depositPaidAt" TIMESTAMP(3),
    "balanceAmount" DOUBLE PRECISION NOT NULL,
    "balancePaid" BOOLEAN NOT NULL DEFAULT false,
    "balancePaidAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodingProject_pkey" PRIMARY KEY ("id")
);
