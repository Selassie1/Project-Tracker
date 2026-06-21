import { AssignmentForm } from "../AssignmentForm";
import { createAssignment } from "../actions";

export default function NewAssignmentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">New assignment</h1>
      <AssignmentForm action={createAssignment} />
    </div>
  );
}
