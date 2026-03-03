'use client'

import {
  AudioLines,
  CheckIcon,
  CopyIcon,
  MicOffIcon,
  RotateCcwIcon,
  Settings2Icon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ui/conversation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Message, MessageContent } from '@/components/ui/message'
import { Orb } from '@/components/ui/orb'
import { Response } from '@/components/ui/response'
import { AVAILABLE_VOICES, type VoiceOption } from '@/app/chat/constants'
import { useVoiceChatController } from '@/app/chat/useVoiceChatController'
import { getMessageText } from '@/app/chat/utils'

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function VoicePage() {
  const {
    messages,
    status,
    assistantMessage,
    selectedVoice,
    setSelectedVoice,
    selectedVoiceProfile,
    orbColors,
    orbAgentState,
    connectionSubtitle,
    connectionSubtitleClass,
    voiceError,
    voiceHint,
    copiedIndex,
    revealedAssistantMessageId,
    revealedAssistantText,
    isAwaitingAssistant,
    lastSpokenAssistantId,
    toggleVoiceSession,
    isSessionActive,
    handleCopy,
    handleRestartConversation,
    isConnecting,
  } = useVoiceChatController()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-2 text-foreground sm:p-4">
      <div className="w-full max-w-2xl">
        <Card className="h-[calc(100vh-1rem)] max-h-155 overflow-hidden border-border/70 bg-background sm:h-155 sm:max-h-[calc(100vh-2rem)]">
          <CardContent className="flex h-full min-h-0 flex-col p-0">
            <header className="flex flex-col gap-3 px-4 pb-3 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:pb-4 sm:pt-6">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="ring-border size-10 overflow-hidden rounded-full ring-1">
                  <Orb className="size-full" agentState={orbAgentState} colors={orbColors} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold sm:text-xl">{selectedVoiceProfile.id}</p>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className={cn('text-sm', connectionSubtitleClass)}>{connectionSubtitle}</p>
                      <span
                        className={cn(
                          'size-2.5 rounded-full',
                          connectionSubtitle === 'Conectado'
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                            : 'bg-muted-foreground/50'
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:items-start sm:gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label="Configurações de voz">
                      <Settings2Icon className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    collisionPadding={16}
                    className="w-[calc(100vw-2rem)] max-w-72 sm:w-72"
                  >
                    <DropdownMenuLabel>Selecionar voz</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={selectedVoice}
                      onValueChange={value => setSelectedVoice(value as VoiceOption)}
                    >
                      {AVAILABLE_VOICES.map(voice => (
                        <DropdownMenuRadioItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{voice.id}</span>
                            <span className="text-muted-foreground text-xs">{voice.description}</span>
                          </div>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRestartConversation}
                  className="shrink-0"
                >
                  <RotateCcwIcon className="mr-1 size-4" />
                  Recomeçar
                </Button>
              </div>
            </header>

            <div className="relative min-h-0 flex-1">
              <Conversation className="flex h-full flex-col">
                <ConversationContent className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
                  {messages.filter(m => getMessageText(m).trim()).length === 0 ? (
                    <ConversationEmptyState
                      icon={<Orb className="size-14" agentState={orbAgentState} colors={orbColors} />}
                      title={isConnecting ? 'Iniciando conversa' : 'Inicie uma conversa'}
                      description={isConnecting ? 'Conectando...' : 'Toque no botão de voz para começar'}
                    />
                  ) : (
                    messages.map((message, index) => {
                      const content = getMessageText(message).trim()
                      if (!content) return null

                      const role = message.role === 'user' ? 'user' : 'assistant'
                      const isPendingSpokenAssistantMessage =
                        role === 'assistant' &&
                        message.id === assistantMessage?.id &&
                        message.id !== lastSpokenAssistantId &&
                        isAwaitingAssistant

                      const visibleContent =
                        role === 'assistant' && message.id === revealedAssistantMessageId
                          ? revealedAssistantText
                          : isPendingSpokenAssistantMessage
                            ? ''
                            : content

                      return (
                        <div key={message.id ?? index} className="flex w-full flex-col gap-1">
                          <Message from={role}>
                            <MessageContent className="max-w-full min-w-0">
                              <Response className="whitespace-pre-wrap wrap-break-word">{visibleContent}</Response>
                            </MessageContent>

                            {role === 'assistant' && (
                              <div className="ring-border size-6 shrink-0 self-end overflow-hidden rounded-full ring-1">
                                <Orb className="size-full" colors={orbColors} />
                              </div>
                            )}
                          </Message>

                          {role === 'assistant' && (
                            <Button
                              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                              size="icon"
                              type="button"
                              variant="ghost"
                              onClick={() => handleCopy(index, content)}
                            >
                              {copiedIndex === index ? (
                                <CheckIcon className="size-4" />
                              ) : (
                                <CopyIcon className="size-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      )
                    })
                  )}

                  {voiceError && <p className="px-1 pt-1 text-sm text-red-400">{voiceError}</p>}

                  {!voiceError && voiceHint && (
                    <p className="text-muted-foreground px-1 pt-1 text-sm">{voiceHint}</p>
                  )}
                </ConversationContent>

                <ConversationScrollButton />
              </Conversation>
            </div>

            <footer className="px-3 pb-4 pt-2 sm:px-4 sm:pb-6">
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => void toggleVoiceSession()}
                  variant={isSessionActive ? 'secondary' : 'default'}
                  disabled={status !== 'ready' && !isSessionActive}
                  className="h-16 w-16 rounded-full ring-2 ring-border/60"
                  aria-label={isSessionActive ? 'Parar gravação' : 'Iniciar gravação'}
                  style={{
                    boxShadow: `0 0 28px ${hexToRgba(orbColors[1], 0.45)}`,
                  }}
                >
                  {isSessionActive ? <MicOffIcon className="size-7" /> : <AudioLines className="size-7" />}
                </Button>
              </div>
            </footer>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
