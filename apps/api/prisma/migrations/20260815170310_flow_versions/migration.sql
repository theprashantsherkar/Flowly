-- CreateTable
CREATE TABLE "flow_versions" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "label" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flow_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flow_versions_flowId_idx" ON "flow_versions"("flowId");

-- AddForeignKey
ALTER TABLE "flow_versions" ADD CONSTRAINT "flow_versions_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "flows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
