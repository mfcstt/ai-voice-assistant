export type VoiceState = '' | 'listening' | 'processing' | 'speaking'

export const SILENCE_THRESHOLD = 0.018
export const SILENCE_DURATION_MS = 1100
export const MIN_RECORDING_MS = 700
export const MAX_RECORDING_MS = 15000
export const NO_SPEECH_TIMEOUT_MS = 3800
export const MAX_CONSECUTIVE_SILENT_TURNS = 3

export const AVAILABLE_VOICES = [
  { id: 'alloy', description: 'Neutra e equilibrada' },
  { id: 'ash', description: 'Clara e precisa' },
  { id: 'ballad', description: 'Melódica e suave' },
  { id: 'coral', description: 'Acolhedora e amigável' },
  { id: 'echo', description: 'Ressonante e profunda' },
  { id: 'sage', description: 'Calma e reflexiva' },
  { id: 'shimmer', description: 'Brilhante e energética' },
  { id: 'verse', description: 'Versátil e expressiva' },
] as const

export type VoiceOption = (typeof AVAILABLE_VOICES)[number]['id']

export const ORB_COLORS_BY_VOICE: Record<VoiceOption, [string, string]> = {
  alloy: ['#C9DDF7', '#AEC9EE'],
  ash: ['#D8D5CF', '#BEB9B1'],
  ballad: ['#E7D3F7', '#D4B6EE'],
  coral: ['#F7C9D5', '#EEB0C2'],
  echo: ['#C7EAF2', '#A9DCE8'],
  sage: ['#CFEBD8', '#B5DECA'],
  shimmer: ['#F8EDC7', '#F2DEAA'],
  verse: ['#D9D2F4', '#C2B7EA'],
}

export const DEFAULT_VOICE: VoiceOption = 'alloy'
export const THREAD_STORAGE_KEY = 'voice-thread-id'
export const VOICE_STORAGE_KEY = 'voice-selected-id'
