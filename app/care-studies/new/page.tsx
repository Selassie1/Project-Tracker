import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { createCareStudy } from "../actions";

export default function NewCareStudyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">New care study</h1>
      <DepositBalanceForm
        action={createCareStudy}
        nameField="condition"
        nameLabel="Condition / topic"
      />
    </div>
  );
}
