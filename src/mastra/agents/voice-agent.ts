import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { OpenAIRealtimeVoice } from '@mastra/voice-openai-realtime';

const voice = new OpenAIRealtimeVoice({
  model: 'gpt-4o-mini-realtime-preview-2024-12-17',
  speaker: 'alloy',
})

voice.updateConfig({
  turn_detection: {
    type: 'server_vad',
    threshold: 0.6,
    silence_duration_ms: 1200,
  },
})

export const voiceAgent = new Agent({
  id: 'voice-agent',
  name: 'Voice Assistant',
  instructions: `
    Você é uma assistente de voz útil, clara e objetiva.

    Regras de resposta:
    - Responda em português por padrão.
    - Seja curta e prática quando a pergunta for simples.
    - Se faltar contexto, faça 1 pergunta direta de clarificação.
    - Quando houver passos, organize em bullets.
  `,
  model: 'openai/gpt-4o',
  voice,
  memory: new Memory(),
});
