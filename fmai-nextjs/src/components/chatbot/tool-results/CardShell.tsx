import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

// One shell for every compact card, as on the Case-inline board: radius 14, padding 14.
export function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="my-2 flex w-full flex-col gap-2.5 rounded-[14px] border border-border-primary bg-bg-elevated p-3.5 text-[13px] text-text-secondary">
      {children}
    </div>
  );
}

export function CardFooter({
  note,
  href,
  label,
}: {
  note?: string;
  href: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border-primary pt-2.5 text-xs">
      <span className="min-w-0 text-text-secondary/70">{note}</span>
      <Link
        href={href}
        className="ml-auto shrink-0 text-[13px] text-accent-system hover:underline"
      >
        {label}
      </Link>
    </div>
  );
}

export function Dot() {
  return (
    <span className="absolute left-0.5 top-[7px] h-1.5 w-1.5 rounded-full bg-accent-system" />
  );
}

export function CardTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h4 className="font-sans text-sm font-semibold text-text-primary">
        {title}
      </h4>
      {sub && <p className="mt-0.5 text-xs text-text-secondary">{sub}</p>}
    </div>
  );
}
