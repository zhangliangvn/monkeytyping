/**
 * Telex engine for Vietnamese diacritics (spec §5, stage "Telex superpower").
 *
 * Vietnamese is typed on QWERTY by composing letters with trigger keys:
 *   vowels   aa→â  ee→ê  oo→ô  aw→ă  ow→ơ  uw→ư  dd→đ
 *   tones    s=sắc  f=huyền  r=hỏi  x=ngã  j=nặng   (z clears the tone)
 *
 * For the game we DECOMPOSE a finished Vietnamese word into the exact keystroke
 * sequence a learner must type, with the tone placed right after its vowel
 * (e.g. "mèo" → m e f o → "mefo"). We also keep a per-display-character mapping
 * so the on-screen word can be colored as the learner types, and a per-character
 * telex hint so we can show "è = e ▸ f".
 */

// Tone order: none, sắc(s), huyền(f), hỏi(r), ngã(x), nặng(j)
const TONE_TRIGGERS = ['', 's', 'f', 'r', 'x', 'j']

// [telex base, precomposed chars in tone order above]
const BASES: Array<[string, string[]]> = [
  ['a', ['a', 'á', 'à', 'ả', 'ã', 'ạ']],
  ['aw', ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ']],
  ['aa', ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ']],
  ['e', ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ']],
  ['ee', ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ']],
  ['i', ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị']],
  ['o', ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ']],
  ['oo', ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ']],
  ['ow', ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ']],
  ['u', ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ']],
  ['uw', ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự']],
  ['y', ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ']],
]

/** Map every precomposed Vietnamese letter → the telex keystrokes that make it. */
export const VN_TO_TELEX: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (const [base, chars] of BASES) {
    chars.forEach((ch, i) => { m[ch] = base + TONE_TRIGGERS[i] })
  }
  m['đ'] = 'dd'
  return m
})()

/** The telex keystrokes for one (lowercased) character; consonants map to themselves. */
export function telexForChar(ch: string): string {
  return VN_TO_TELEX[ch] ?? ch
}

export interface TelexTarget {
  /** The Vietnamese word shown to the learner, e.g. "mèo". */
  display: string
  /** The exact keystroke sequence to type, e.g. "mefo". */
  telex: string
  /** For each telex key index, which display-character index it belongs to. */
  telexToDisplay: number[]
  /** For each display character, its telex keystrokes (for hints like "è = e ▸ f"). */
  displayTelex: string[]
}

/** Decompose a Vietnamese word into its telex typing target. */
export function buildTelexTarget(word: string): TelexTarget {
  let telex = ''
  const telexToDisplay: number[] = []
  const displayTelex: string[] = []
  for (let i = 0; i < word.length; i++) {
    const ch = word[i]!
    const seq = telexForChar(ch.toLowerCase())
    displayTelex.push(seq)
    for (let k = 0; k < seq.length; k++) telexToDisplay.push(i)
    telex += seq
  }
  return { display: word, telex, telexToDisplay, displayTelex }
}
