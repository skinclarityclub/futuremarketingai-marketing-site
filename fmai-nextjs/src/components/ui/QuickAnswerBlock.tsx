interface QuickAnswerBlockProps {
  definition: string
}

export function QuickAnswerBlock({ definition }: QuickAnswerBlockProps) {
  return (
    <div
      className="border-l-4 border-[#00D4FF] bg-[#00D4FF]/5 px-6 py-4 rounded-r-lg"
      role="note"
      aria-label="Quick answer"
    >
      <p className="text-base text-white/90">{definition}</p>
    </div>
  )
}
