import { AssignmentForm } from "../AssignmentForm";
import { createAssignment } from "../actions";

export default function NewAssignmentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">New assignment</h1>
      <AssignmentForm action={createAssignment} />
    </div>
  );
}
