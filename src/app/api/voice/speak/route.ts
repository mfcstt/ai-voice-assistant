const OPENAI_SPEECH_URL = 'https://api.openai.com/v1/audio/speech'
const ALLOWED_VOICES = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'] as const
type VoiceName = (typeof ALLOWED_VOICES)[number]

const normalizeVoice = (value: unknown): VoiceName => {
  if (typeof value !== 'string') return 'alloy'

  const normalized = value.trim().toLowerCase()
  if (ALLOWED_VOICES.includes(normalized as VoiceName)) {
    return normalized as VoiceName
  }

  return 'alloy'
}

export async function POST(req: Request) {
  try {
    const { text, voice } = (await req.json()) as { text?: string; voice?: string }

    if (!text?.trim()) {
      return Response.json({ error: 'Texto é obrigatório para síntese.' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'OPENAI_API_KEY não configurada.' }, { status: 500 })
    }

    const selectedVoice = normalizeVoice(voice)

    const response = await fetch(OPENAI_SPEECH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: selectedVoice,
        input: text,
        format: 'wav',
      }),
    })

    if (!response.ok) {
      const payload = (await response.json()) as { error?: { message?: string } }
      const error = payload.error?.message || 'Falha ao gerar áudio.'
      return Response.json({ error }, { status: 500 })
    }

    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Voice speak error:', error)
    const message = error instanceof Error ? error.message : 'Falha ao gerar voz.'
    return Response.json({ error: message }, { status: 500 })
  }
}
