"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/assignments", label: "Assignments" },
  { href: "/research", label: "Research" },
  { href: "/care-studies", label: "Care Studies" },
  { href: "/coding", label: "Coding" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2 font-semibold text-white">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />
          Project Tracker
        </span>

        <div className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => (
            <NavLink key={link.href} link={link} active={pathname === link.href} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-slate-300 hover:bg-white/10 sm:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-slate-800 px-4 py-3 sm:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.href}
              link={link}
              active={pathname === link.href}
              onClick={() => setOpen(false)}
              block
            />
          ))}
        </div>
      )}
    </nav>
  );
}

function NavLink({
  link,
  active,
  onClick,
  block,
}: {
  link: { href: string; label: string };
  active: boolean;
  onClick?: () => void;
  block?: boolean;
}) {
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        block ? "block" : ""
      } ${active ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
    >
      {link.label}
    </Link>
  );
}
