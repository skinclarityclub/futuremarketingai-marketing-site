import { useCallback, useEffect, useRef, useState } from 'react'
import Vapi from '@vapi-ai/web'

export interface TranscriptMessage {
  role: 'assistant' | 'user'
  text: string
  timestamp: number
}

export type CallState = 'idle' | 'connecting' | 'active' | 'ending'

export interface UseVapiCallReturn {
  state: CallState
  start: () => void
  stop: () => void
  volumeLevel: number
  transcript: TranscriptMessage[]
  duration: number
  error: string | null
}

export function useVapiCall(): UseVapiCallReturn {
  const vapiRef = useRef<Vapi | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const [state, setState] = useState<CallState>('idle')
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY
    if (!publicKey) {
      console.warn('[useVapiCall] Missing VITE_VAPI_PUBLIC_KEY')
      return
    }
    vapiRef.current = new Vapi(publicKey)

    const vapi = vapiRef.current

    vapi.on('call-start', () => {
      setState('active')
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    })

    vapi.on('call-end', () => {
      setState('idle')
      setVolumeLevel(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    })

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level)
    })

    vapi.on('message', (msg: any) => {
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          {
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            text: msg.transcript,
            timestamp: Date.now(),
          },
        ])
      }
    })

    vapi.on('error', (err: any) => {
      console.error('[useVapiCall] Error:', err)
      setError(typeof err === 'string' ? err : err?.message || 'Call failed')
      setState('idle')
    })

    return () => {
      vapi.removeAllListeners()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const start = useCallback(() => {
    const assistantId = import.meta.env.VITE_VAPI_DEMO_ASSISTANT_ID
    if (!vapiRef.current || !assistantId) {
      setError('Voice demo not configured')
      return
    }
    setError(null)
    setTranscript([])
    setDuration(0)
    setState('connecting')
    vapiRef.current.start(assistantId)
  }, [])

  const stop = useCallback(() => {
    if (!vapiRef.current) {
      return
    }
    setState('ending')
    vapiRef.current.stop()
  }, [])

  return { state, start, stop, volumeLevel, transcript, duration, error }
}
