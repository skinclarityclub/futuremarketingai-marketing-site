'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface TranscriptMessage {
  role: 'assistant' | 'user'
  text: string
  timestamp: number
}

export type CallState = 'idle' | 'connecting' | 'active' | 'ending'

export interface UseElevenLabsCallReturn {
  state: CallState
  start: () => void
  stop: () => void
  volumeLevel: number
  transcript: TranscriptMessage[]
  duration: number
  error: string | null
  isAvailable: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ElevenLabsModule = { useConversation?: any; [key: string]: any }

/**
 * Hook for ElevenLabs voice call integration.
 * Gracefully degrades when the ElevenLabs SDK or agent ID is unavailable.
 * Returns `isAvailable: false` when the API cannot be used.
 *
 * The hook attempts a dynamic import of @elevenlabs/react at runtime.
 * If the package is not installed or the agent ID env var is missing,
 * all call methods become no-ops and VoiceDemoSection shows a fallback UI.
 */
export function useElevenLabsCall(): UseElevenLabsCallReturn {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const sdkRef = useRef<ElevenLabsModule | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>(null)

  const [callState, setCallState] = useState<CallState>('idle')
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)

  // Check availability on mount: require both env var AND SDK
  useEffect(() => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
    if (!agentId) {
      setIsAvailable(false)
      return
    }

    let cancelled = false

    // Dynamic import wrapped in try/catch for environments without the package
    ;(async () => {
      try {
        // Use a variable to prevent webpack from resolving statically
        const pkgName = '@elevenlabs/react'
        const mod = await import(/* webpackIgnore: true */ pkgName)
        if (!cancelled) {
          sdkRef.current = mod
          setIsAvailable(true)
        }
      } catch {
        if (!cancelled) {
          sdkRef.current = null
          setIsAvailable(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const start = useCallback(async () => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
    if (!agentId || !isAvailable || !sdkRef.current) {
      setError('Voice demo not configured')
      return
    }

    setError(null)
    setTranscript([])
    setDuration(0)
    setCallState('connecting')

    try {
      // The SDK's useConversation hook cannot be called here (rules of hooks),
      // so we use the lower-level Conversation API if available, or the client SDK.
      const sdk = sdkRef.current
      const ConversationClass = sdk.Conversation || sdk.default?.Conversation

      if (ConversationClass?.startSession) {
        const session = await ConversationClass.startSession({
          agentId,
          onConnect: () => {
            setCallState('active')
            startTimeRef.current = Date.now()
            timerRef.current = setInterval(() => {
              setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
            }, 1000)
          },
          onDisconnect: () => {
            setCallState('idle')
            setVolumeLevel(0)
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
          },
          onError: (message: string) => {
            console.error('[ElevenLabs] Error:', message)
            setError(message || 'Connection error')
            setCallState('idle')
            setVolumeLevel(0)
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
          },
          onMessage: (message: { source: string; message: string }) => {
            if (message.message) {
              setTranscript((prev) => [
                ...prev,
                {
                  role: message.source === 'ai' ? 'assistant' : 'user',
                  text: message.message,
                  timestamp: Date.now(),
                },
              ])
            }
          },
        })
        sessionRef.current = session
      } else {
        // SDK doesn't have the expected API -- fall back
        setError('Voice SDK not compatible')
        setCallState('idle')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
      setCallState('idle')
    }
  }, [isAvailable])

  const stop = useCallback(async () => {
    setCallState('ending')
    try {
      if (sessionRef.current?.endSession) {
        await sessionRef.current.endSession()
      }
    } catch {
      // Session may already be ended
    }
    sessionRef.current = null
    setCallState('idle')
    setVolumeLevel(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return {
    state: callState,
    start,
    stop,
    volumeLevel,
    transcript,
    duration,
    error,
    isAvailable,
  }
}
