type Assignment = {
  clientName: string;
  whatsappNumber: string;
  topic: string;
  amountCharged: number;
  deadline: Date;
  status: string;
  notes: string | null;
};

export function AssignmentForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: Assignment;
}) {
  const deadlineValue = initial ? new Date(initial.deadline).toISOString().slice(0, 10) : "";

  return (
    <form action={action} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name">
          <input name="clientName" required defaultValue={initial?.clientName} className="input" />
        </Field>
        <Field label="WhatsApp number">
          <input
            name="whatsappNumber"
            required
            placeholder="e.g. 233241234567"
            defaultValue={initial?.whatsappNumber}
            className="input"
          />
        </Field>
      </div>
      <Field label="Topic">
        <input name="topic" required defaultValue={initial?.topic} className="input" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Amount charged (USD)">
          <input
            name="amountCharged"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initial?.amountCharged}
            className="input"
          />
        </Field>
        <Field label="Deadline">
          <input
            name="deadline"
            type="date"
            required
            defaultValue={deadlineValue}
            className="input"
          />
        </Field>
      </div>
      <Field label="Status">
        <select name="status" defaultValue={initial?.status ?? "PENDING"} className="input">
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </Field>
      <Field label="Notes">
        <textarea name="notes" rows={3} defaultValue={initial?.notes ?? ""} className="input" />
      </Field>
      <button type="submit" className="btn-primary">
        Save assignment
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}
