-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "doneAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "researchProjectId" TEXT,
    "careStudyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Milestone_researchProjectId_idx" ON "Milestone"("researchProjectId");

-- CreateIndex
CREATE INDEX "Milestone_careStudyId_idx" ON "Milestone"("careStudyId");

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_researchProjectId_fkey" FOREIGN KEY ("researchProjectId") REFERENCES "ResearchProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_careStudyId_fkey" FOREIGN KEY ("careStudyId") REFERENCES "CareStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
