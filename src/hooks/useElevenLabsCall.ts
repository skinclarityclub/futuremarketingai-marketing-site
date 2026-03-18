import { useConversation } from '@elevenlabs/react'
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
}

export function useElevenLabsCall(): UseElevenLabsCallReturn {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const [callState, setCallState] = useState<CallState>('idle')
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const conversation = useConversation({
    onConnect: () => {
      console.log('[ElevenLabs] Connected')
      setCallState('active')
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] Disconnected')
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

  // Track agent speaking state as volume proxy
  useEffect(() => {
    setVolumeLevel(conversation.isSpeaking ? 0.6 : 0)
  }, [conversation.isSpeaking])

  const start = useCallback(async () => {
    const agentId = import.meta.env.VITE_ELEVENLABS_DEMO_AGENT_ID
    if (!agentId) {
      setError('Voice demo not configured')
      return
    }
    setError(null)
    setTranscript([])
    setDuration(0)
    setCallState('connecting')
    try {
      await conversation.startSession({ agentId, connectionType: 'webrtc' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
      setCallState('idle')
    }
  }, [conversation])

  const stop = useCallback(async () => {
    setCallState('ending')
    try {
      await conversation.endSession()
    } catch {
      // Session may already be ended
      setCallState('idle')
    }
  }, [conversation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return { state: callState, start, stop, volumeLevel, transcript, duration, error }
}
