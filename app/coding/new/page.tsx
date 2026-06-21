import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { createCodingProject } from "../actions";

export default function NewCodingProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">New coding project</h1>
      <DepositBalanceForm
        action={createCodingProject}
        nameField="projectName"
        nameLabel="Project name"
      />
    </div>
  );
}
