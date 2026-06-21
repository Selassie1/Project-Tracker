import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm">
      <div className="card space-y-4 p-6">
        <h1 className="text-2xl font-bold text-white">Sign in</h1>
        {error && <p className="text-sm text-rose-400">Wrong password.</p>}
        <form action={login} className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/"} />
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Password"
            className="input"
          />
          <button type="submit" className="btn-primary w-full justify-center">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
