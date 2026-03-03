export const getMessageText = (message: {
  parts?: Array<{ type: string; text?: string }>
}) =>
  (message.parts || [])
    .filter(part => part.type === 'text' && Boolean(part.text))
    .map(part => part.text)
    .join('\n')

export const createThreadId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `voice-${crypto.randomUUID()}`
  }

  return `voice-${Date.now()}`
}
