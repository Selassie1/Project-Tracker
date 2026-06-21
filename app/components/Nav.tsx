"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/assignments", label: "Assignments" },
  { href: "/research", label: "Research" },
  { href: "/care-studies", label: "Care Studies" },
  { href: "/coding", label: "Coding" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-3">
        <span className="mb-2 flex items-center gap-2 font-semibold text-white sm:mb-0 sm:hidden">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />
          Project Tracker
        </span>
        <div className="flex items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="mr-6 hidden flex-shrink-0 items-center gap-2 font-semibold text-white sm:flex">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />
            Project Tracker
          </span>
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-violet-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
