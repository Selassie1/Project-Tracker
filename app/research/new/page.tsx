import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { createResearchProject } from "../actions";

export default function NewResearchProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">New research project</h1>
      <DepositBalanceForm
        action={createResearchProject}
        nameField="topic"
        nameLabel="Research topic"
      />
    </div>
  );
}
