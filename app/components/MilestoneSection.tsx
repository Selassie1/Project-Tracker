import { formatDate, isOverdue } from "@/app/lib/format";
import { addMilestone, toggleMilestone, deleteMilestone } from "@/app/lib/milestoneActions";
import { SubmitButton } from "./SubmitButton";

type Milestone = {
  id: string;
  title: string;
  dueDate: Date | null;
  isDone: boolean;
};

type Parent = "research" | "care-study";

export function MilestoneSection({
  parent,
  parentId,
  milestones,
}: {
  parent: Parent;
  parentId: string;
  milestones: Milestone[];
}) {
  const done = milestones.filter((m) => m.isDone).length;

  return (
    <section className="card space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Sections &amp; chapters</h2>
          <p className="text-sm text-slate-400">
            Break this job into parts with their own due dates.
          </p>
        </div>
        {milestones.length > 0 && (
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            {done}/{milestones.length} done
          </span>
        )}
      </div>

      {milestones.length > 0 && (
        <ul className="space-y-2">
          {milestones.map((m) => {
            const overdue = !m.isDone && isOverdue(m.dueDate, "PENDING");
            return (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <form action={toggleMilestone.bind(null, parent, parentId, m.id, !m.isDone)}>
                    <button
                      type="submit"
                      aria-label={m.isDone ? "Mark not done" : "Mark done"}
                      className={`flex h-5 w-5 items-center justify-center rounded border transition ${
                        m.isDone
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-600 hover:border-violet-500"
                      }`}
                    >
                      {m.isDone && (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </form>
                  <div>
                    <p className={`text-sm font-medium ${m.isDone ? "text-slate-500 line-through" : "text-white"}`}>
                      {m.title}
                    </p>
                    {m.dueDate && (
                      <p className={`text-xs ${overdue ? "font-semibold text-rose-400" : "text-slate-400"}`}>
                        Due {formatDate(m.dueDate)}
                        {overdue ? " · overdue" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <form action={deleteMilestone.bind(null, parent, parentId, m.id)}>
                  <button type="submit" className="text-xs font-medium text-slate-500 hover:text-rose-400">
                    Remove
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      <form action={addMilestone.bind(null, parent, parentId)} className="flex flex-wrap items-end gap-3">
        <label className="flex-1 min-w-[10rem]">
          <span className="mb-1 block text-sm font-medium text-slate-300">Section</span>
          <input name="title" required placeholder="e.g. Chapter 1" className="input" />
        </label>
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-300">Due date</span>
          <input name="dueDate" type="date" className="input" />
        </label>
        <SubmitButton className="btn-primary" pendingLabel="Adding…">
          Add section
        </SubmitButton>
      </form>
    </section>
  );
}
