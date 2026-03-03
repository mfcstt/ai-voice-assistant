const OPENAI_TRANSCRIBE_URL = 'https://api.openai.com/v1/audio/transcriptions'

export async function POST(req: Request) {
  try {
    const requestFormData = await req.formData()
    const file = requestFormData.get('audio')

    if (!(file instanceof File)) {
      return Response.json({ error: 'Arquivo de áudio não enviado.' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'OPENAI_API_KEY não configurada.' }, { status: 500 })
    }

    const transcriptionFormData = new FormData()
    transcriptionFormData.append('file', file, file.name || 'recording.webm')
    transcriptionFormData.append('model', 'whisper-1')
    transcriptionFormData.append('language', 'pt')
    transcriptionFormData.append(
      'prompt',
      'Transcreva em português do Brasil preservando nomes próprios corretamente.'
    )
    transcriptionFormData.append('temperature', '0')

    const response = await fetch(OPENAI_TRANSCRIBE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: transcriptionFormData,
    })

    const payload = (await response.json()) as { text?: string; error?: { message?: string } }

    if (!response.ok || !payload.text?.trim()) {
      const error = payload.error?.message || 'Falha ao transcrever áudio.'
      return Response.json({ error }, { status: 500 })
    }

    return Response.json({ text: payload.text })
  } catch (error) {
    console.error('Voice transcribe error:', error)
    return Response.json({ error: 'Falha ao transcrever áudio.' }, { status: 500 })
  }
}
