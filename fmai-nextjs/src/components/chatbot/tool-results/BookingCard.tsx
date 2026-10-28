"use client";

import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useChatbotStore } from "@/stores/chatbotStore";
import { useChatChrome } from "../useChatChrome";
import { useCardCopy } from "./cardI18n";
import { CardShell, CardTitle } from "./CardShell";

export interface BookingCardData {
  action: string;
  url: string;
  reason?: string;
}

// The tool's `reason` is a machine label ("kennismaking"), not copy, so it is not shown.
export function BookingCard() {
  const { t } = useCardCopy();
  const { applyCta } = useChatChrome();
  const close = useChatbotStore((s) => s.close);
  const trustSignals = [
    { icon: MessageCircle, label: t.trustPersonal },
    { icon: Clock, label: t.trustResponse },
    { icon: ShieldCheck, label: t.trustNoStrings },
  ];

  return (
    <CardShell>
      <CardTitle title={t.bookingTitle} sub={t.bookingSubtitle} />
      <ul className="flex list-none flex-col gap-1 p-0">
        {trustSignals.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2">
            <Icon
              className="h-3.5 w-3.5 shrink-0 text-accent-system/70"
              aria-hidden
            />
            {label}
          </li>
        ))}
      </ul>
      {/* The tool's url is absolute and production-only; Link keeps the visitor on this origin. */}
      <Link
        href="/apply"
        onClick={() => close()}
        className="flex w-full items-center justify-center rounded-[var(--radius-btn)] bg-accent-human px-4 py-2.5 text-[13px] font-semibold text-bg-deep transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
      >
        {applyCta}
      </Link>
    </CardShell>
  );
}

export default BookingCard;
