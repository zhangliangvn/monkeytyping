/**
 * Text-to-speech via the Web Speech API — reads each word aloud so the child
 * hears it while typing (English listening + typing together; Vietnamese words
 * read with correct pronunciation in Telex mode). Safe no-op when speech
 * synthesis is unavailable (e.g. jsdom/tests) or muted.
 */
export type SpeakLang = 'en' | 'vi'

const LANG_TAG: Record<SpeakLang, string> = { en: 'en-US', vi: 'vi-VN' }

export interface TtsOptions { muted?: boolean; rate?: number }

export class Tts {
  muted: boolean
  rate: number
  private voices: SpeechSynthesisVoice[] = []

  constructor(opts: TtsOptions = {}) {
    this.muted = opts.muted ?? false
    this.rate = opts.rate ?? 0.9
    this.refreshVoices()
    try {
      const s = this.synth()
      if (s && 'onvoiceschanged' in s) {
        s.addEventListener('voiceschanged', () => this.refreshVoices())
      }
    } catch { /* ignore */ }
  }

  private synth(): SpeechSynthesis | undefined {
    const w = globalThis as unknown as { speechSynthesis?: SpeechSynthesis }
    return w.speechSynthesis
  }

  private refreshVoices(): void {
    try { this.voices = this.synth()?.getVoices() ?? [] } catch { this.voices = [] }
  }

  private pickVoice(lang: SpeakLang): SpeechSynthesisVoice | undefined {
    if (this.voices.length === 0) this.refreshVoices()
    const want = lang === 'en' ? 'en' : 'vi'
    return this.voices.find((v) => v.lang?.toLowerCase().startsWith(want))
  }

  /** Speak a word, cancelling anything still playing. */
  speak(text: string, lang: SpeakLang = 'en'): void {
    if (this.muted || !text) return
    const s = this.synth()
    if (!s) return
    try {
      const Utter = (globalThis as unknown as { SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance })
        .SpeechSynthesisUtterance
      if (!Utter) return
      s.cancel()
      const u = new Utter(text)
      u.lang = LANG_TAG[lang]
      u.rate = this.rate
      const v = this.pickVoice(lang)
      if (v) u.voice = v
      s.speak(u)
    } catch { /* ignore unsupported */ }
  }

  cancel(): void {
    try { this.synth()?.cancel() } catch { /* ignore */ }
  }
}
