import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-900/40">
            <span className="h-3 w-3 rounded-full bg-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Project Tracker</h1>
          <p className="text-sm text-slate-400">Sign in to manage your work.</p>
        </div>

        <div className="card space-y-4 p-6">
          {error && (
            <p className="rounded-lg border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">
              Wrong password. Try again.
            </p>
          )}
          <form action={login} className="space-y-4">
            <input type="hidden" name="next" value={next ?? "/"} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-300">Password</span>
              <input
                type="password"
                name="password"
                required
                autoFocus
                placeholder="••••••••"
                className="input"
              />
            </label>
            <button type="submit" className="btn-primary w-full justify-center">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
