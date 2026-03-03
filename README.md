# AI Voice Assistant

Assistente de voz em português com interface web, transcrição de áudio, memória de conversa e resposta falada.

## Visão geral

Este projeto implementa um fluxo de conversa por voz de ponta a ponta:

- captura de áudio no navegador;
- transcrição para texto;
- resposta de agente com memória;
- síntese de voz da resposta;
- reprodução do áudio no cliente.

## Stack

### Front-end

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- shadcn/ui + Radix UI

### IA e back-end

- API Routes do Next.js (`/api/voice/*`)
- Vercel AI SDK (`ai` e `@ai-sdk/react`)
- Mastra (`@mastra/core`, `@mastra/memory`, `@mastra/libsql`, `@mastra/observability`)
- OpenAI APIs:
	- Chat: `openai/gpt-4o`
	- Transcrição: `whisper-1`
	- TTS: `gpt-4o-mini-tts`

## Fluxo da aplicação

1. Usuário abre a interface em `/chat` e inicia a sessão de voz.
2. O cliente grava o microfone com `MediaRecorder` e detecção de silêncio.
3. O áudio é enviado para `POST /api/voice/transcribe`.
4. O texto transcrito é enviado para `POST /api/voice/chat`.
5. A rota de chat aciona o agente `voice-agent` via Mastra e mantém contexto por `threadId`.
6. A resposta textual do agente é enviada para `POST /api/voice/speak`.
7. O áudio WAV retornado é reproduzido no cliente com atualização visual do estado (`listening`, `processing`, `speaking`).

## Memória e persistência

- O `threadId` da conversa é salvo no `localStorage`.
- A memória do agente usa recurso `voice-chat` por thread.
- O armazenamento do Mastra usa LibSQL em arquivo local `mastra.db`.

## Estrutura principal

- `src/app/page.tsx`: home
- `src/app/chat/page.tsx`: interface principal de voz.
- `src/app/chat/useVoiceChatController.ts`: orquestração do fluxo de voz no cliente.
- `src/app/api/voice/chat/route.ts`: chat com agente Mastra + memória.
- `src/app/api/voice/transcribe/route.ts`: transcrição de áudio.
- `src/app/api/voice/speak/route.ts`: síntese de voz.
- `src/mastra/agents/voice-agent.ts`: definição do agente e instruções.
- `src/mastra/index.ts`: configuração do runtime Mastra (storage, logger, observability).

## Pré-requisitos

- Node.js 20+
- npm
- Chave da OpenAI

## Configuração de ambiente

Crie um arquivo `.env` na raiz com:

```env
OPENAI_API_KEY=sua_chave_aqui
```

## Como rodar localmente

```bash
npm install
npm run dev
```

Aplicação disponível em:

- `http://localhost:3000`
- Tela de conversa por voz: `http://localhost:3000/chat`

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de produção
- `npm run start`: inicia build em produção
- `npm run lint`: validação de lint

## Endpoints

- `POST /api/voice/transcribe`
	- Entrada: `multipart/form-data` com campo `audio`
	- Saída: `{ "text": "..." }`

- `POST /api/voice/chat`
	- Entrada: payload de mensagens + `threadId`
	- Saída: stream de mensagens do agente

- `GET /api/voice/chat?threadId=...`
	- Saída: histórico da thread

- `POST /api/voice/speak`
	- Entrada: `{ "text": "...", "voice": "alloy|ash|..." }`
	- Saída: `audio/wav`

## Observações
- As vozes disponíveis e estilos visuais por voz ficam em `src/app/chat/constants.ts`.
