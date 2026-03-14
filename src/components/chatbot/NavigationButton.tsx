import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useChatbotStore } from '../../stores/chatbotStore'

interface NavigationButtonProps {
  url: string
  label: string
}

export function NavigationButton({ url, label }: NavigationButtonProps) {
  const navigate = useNavigate()
  const close = useChatbotStore((s) => s.close)

  const handleClick = () => {
    close()
    navigate(url)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-system/10 border border-accent-system/30 text-accent-system text-sm font-medium hover:bg-accent-system/20 transition-colors cursor-pointer"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </button>
  )
}

export default NavigationButton
