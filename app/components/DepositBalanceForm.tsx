type DepositBalanceInitial = {
  clientName: string;
  whatsappNumber: string;
  amountCharged: number;
  depositAmount: number;
  balanceAmount: number;
  deadline: Date | null;
  status: string;
  notes: string | null;
};

export function DepositBalanceForm({
  action,
  nameField,
  nameLabel,
  initial,
  initialName,
}: {
  action: (formData: FormData) => void;
  nameField: string;
  nameLabel: string;
  initial?: DepositBalanceInitial;
  initialName?: string;
}) {
  const deadlineValue = initial?.deadline
    ? new Date(initial.deadline).toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
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
      <Field label={nameLabel}>
        <input name={nameField} required defaultValue={initialName} className="input" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Total amount charged (USD)">
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
        <Field label="Deposit amount (USD)">
          <input
            name="depositAmount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initial?.depositAmount}
            className="input"
          />
        </Field>
        <Field label="Balance amount (USD)">
          <input
            name="balanceAmount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initial?.balanceAmount}
            className="input"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Expected deadline (optional)">
          <input name="deadline" type="date" defaultValue={deadlineValue} className="input" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={initial?.status ?? "PENDING"} className="input">
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </Field>
      </div>
      <Field label="Notes">
        <textarea name="notes" rows={3} defaultValue={initial?.notes ?? ""} className="input" />
      </Field>
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
