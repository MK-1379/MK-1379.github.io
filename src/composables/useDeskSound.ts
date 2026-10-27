import { ref } from 'vue'

const STORAGE_KEY = 'desk-sound'
const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 587.33]

const enabled = ref(false)
let context: AudioContext | null = null
let musicTimer = 0

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

function save(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off')
  } catch {}
}

function audio() {
  context ??= new AudioContext()
  return context
}

function tone(frequency: number, delay: number, duration: number, volume: number) {
  const ctx = audio()
  if (ctx.state !== 'running') {
    void ctx.resume()
    return
  }
  const start = ctx.currentTime + delay
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'triangle'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.05)
}

function click() {
  if (!enabled.value) return
  tone(880, 0, 0.12, 0.05)
  tone(1320, 0.04, 0.1, 0.035)
}

function startMusic() {
  if (!enabled.value || musicTimer) return
  let step = 0
  function play() {
    tone(melody[step % melody.length] ?? 523.25, 0, 0.35, 0.04)
    step++
  }
  play()
  musicTimer = window.setInterval(play, 280)
}

function stopMusic() {
  window.clearInterval(musicTimer)
  musicTimer = 0
}

async function toggle() {
  enabled.value = !enabled.value
  save(enabled.value)
  if (!enabled.value) {
    stopMusic()
    return
  }
  await audio().resume()
  click()
}

export function useDeskSound() {
  function init() {
    enabled.value = readStored()
  }

  return { enabled, init, toggle, click, startMusic, stopMusic }
}
