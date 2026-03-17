import { VapiWidget } from '@vapi-ai/client-sdk-react'

export function VoiceDemoWidget() {
  const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY
  const assistantId = import.meta.env.VITE_VAPI_DEMO_ASSISTANT_ID

  if (!publicKey || !assistantId) {
    console.warn('VoiceDemoWidget: Missing VITE_VAPI_PUBLIC_KEY or VITE_VAPI_DEMO_ASSISTANT_ID')
    return null
  }

  return (
    <VapiWidget
      publicKey={publicKey}
      assistantId={assistantId}
      mode="voice"
      theme="dark"
      position="bottom-right"
      accentColor="#00D4AA"
      baseBgColor="#0A0D14"
      ctaButtonColor="#00D4AA"
      ctaButtonTextColor="#0A0D14"
      title="Talk to our AI Agent"
      startButtonText="Start Call"
      endButtonText="End Call"
      ctaTitle="Try it live"
      ctaSubtitle="Talk to our AI"
      voiceShowTranscript={true}
      onVoiceStart={() => console.log('[VoiceDemo] Call started')}
      onVoiceEnd={() => console.log('[VoiceDemo] Call ended')}
      onError={(err: Error) => console.error('[VoiceDemo] Error:', err)}
    />
  )
}
