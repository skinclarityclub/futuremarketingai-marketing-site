interface SuggestedPromptsProps {
  prompts: string[]
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function SuggestedPrompts({ prompts, onSelect, disabled = false }: SuggestedPromptsProps) {
  if (prompts.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3" style={{ animation: 'fadeIn 0.3s ease-in' }}>
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="cursor-pointer rounded-full border border-border-primary bg-bg-elevated/80 px-3 py-1.5 font-sans text-xs text-text-secondary transition-colors duration-200 hover:border-accent-system/50 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}

export default SuggestedPrompts
