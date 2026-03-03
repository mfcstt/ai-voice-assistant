import { handleChatStream } from '@mastra/ai-sdk'
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui'
import { createUIMessageStreamResponse } from 'ai'
import { NextResponse } from 'next/server'
import { mastra } from '@/mastra/index'

const DEFAULT_THREAD_ID = 'voice-default-thread'
const RESOURCE_ID = 'voice-chat'

const sanitizeThreadId = (value: unknown) => {
  if (typeof value !== 'string') return DEFAULT_THREAD_ID

  const normalized = value.trim()
  return normalized.length > 0 ? normalized : DEFAULT_THREAD_ID
}

export async function POST(req: Request) {
  const params = await req.json()
  const threadId = sanitizeThreadId(params.threadId ?? params.memory?.thread)

  const stream = await handleChatStream({
    mastra,
    agentId: 'voice-agent',
    params: {
      ...params,
      memory: {
        ...params.memory,
        thread: threadId,
        resource: RESOURCE_ID,
      },
    },
  })

  return createUIMessageStreamResponse({ stream })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const threadId = sanitizeThreadId(searchParams.get('threadId'))
  const memory = await mastra.getAgentById('voice-agent').getMemory()
  let response = null

  try {
    response = await memory?.recall({
      threadId,
      resourceId: RESOURCE_ID,
    })
  } catch {
    console.log('No previous voice assistant messages found.')
  }

  const uiMessages = toAISdkV5Messages(response?.messages || [])

  return NextResponse.json(uiMessages)
}
