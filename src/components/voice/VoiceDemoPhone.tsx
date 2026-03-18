import { Mic, PhoneOff, Loader2 } from 'lucide-react'
import { WaveformVisualizer } from './WaveformVisualizer'
import { CallTranscript } from './CallTranscript'
import type { UseElevenLabsCallReturn } from '../../hooks/useElevenLabsCall'
import { cn } from '../../lib/utils'

interface VoiceDemoPhoneProps {
  call: UseElevenLabsCallReturn
  compact?: boolean
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function VoiceDemoPhone({ call, compact = false }: VoiceDemoPhoneProps) {
  const { state, start, stop, volumeLevel, transcript, duration, error } = call
  const isIdle = state === 'idle'
  const isConnecting = state === 'connecting'
  const isActive = state === 'active'
  const isEnding = state === 'ending'

  return (
    <div
      className={cn(
        'flex flex-col bg-bg-deep text-text-primary overflow-hidden',
        compact ? 'h-[400px] w-[280px]' : 'h-[520px] w-[280px]'
      )}
    >
      <div className="flex flex-col items-center pt-8 pb-4 px-4 flex-shrink-0">
        <div
          className={cn(
            'relative w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-all duration-500',
            isActive ? 'bg-accent-system/20 shadow-glow' : 'bg-accent-system/10'
          )}
        >
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              isActive ? 'bg-accent-system/30' : 'bg-accent-system/15'
            )}
          >
            <Mic
              className={cn(
                'w-7 h-7 transition-colors',
                isActive ? 'text-accent-system' : 'text-accent-system/60'
              )}
            />
          </div>
          {isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-accent-system/40 animate-ping" />
          )}
        </div>

        <span className="text-sm font-display font-semibold text-text-primary">ARIA</span>
        <span className="text-xs text-text-muted">
          {isIdle && 'AI Voice Agent'}
          {isConnecting && 'Connecting...'}
          {isActive && formatDuration(duration)}
          {isEnding && 'Ending call...'}
        </span>
      </div>

      {(isActive || isConnecting) && (
        <div className="px-4 flex-shrink-0">
          <WaveformVisualizer
            volumeLevel={volumeLevel}
            isActive={isActive}
            barCount={compact ? 16 : 24}
          />
        </div>
      )}

      {isActive && transcript.length > 0 && (
        <CallTranscript messages={transcript} className="mt-2 flex-1 min-h-0" />
      )}

      {isIdle && <div className="flex-1" />}

      {error && (
        <div className="mx-4 mb-2 px-3 py-2 bg-error/10 border border-error/20 rounded-lg text-xs text-error text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center pb-8 pt-4 flex-shrink-0">
        {isIdle || isConnecting ? (
          <>
            <button
              onClick={start}
              disabled={isConnecting}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
                'bg-accent-system hover:bg-accent-system/90 shadow-glow',
                isConnecting ? 'opacity-70' : 'cta-pulse'
              )}
              aria-label="Start voice call with AI agent"
            >
              {isConnecting ? (
                <Loader2 className="w-7 h-7 text-bg-deep animate-spin" />
              ) : (
                <Mic className="w-7 h-7 text-bg-deep" />
              )}
            </button>
            {isIdle && <span className="text-[11px] text-text-muted mt-2">Tap to start</span>}
          </>
        ) : (
          <button
            onClick={stop}
            disabled={isEnding}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
              'bg-error hover:bg-error/90',
              isEnding && 'opacity-70'
            )}
            aria-label="End call"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
