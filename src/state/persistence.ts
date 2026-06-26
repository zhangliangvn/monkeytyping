/** localStorage persistence for progress — safe when storage is unavailable. */
import { ProgressStore } from './progress'

const KEY = 'monkey-typing:progress:v1'

export function loadProgress(): ProgressStore {
  try {
    const raw = globalThis.localStorage?.getItem(KEY)
    return raw ? ProgressStore.deserialize(raw) : new ProgressStore()
  } catch {
    return new ProgressStore()
  }
}

export function saveProgress(store: ProgressStore): void {
  try {
    globalThis.localStorage?.setItem(KEY, store.serialize())
  } catch {
    /* ignore quota / unavailable storage */
  }
}
