export const deskItemIds = [
  'lolstats',
  'bracketly',
  'kumafy',
  'clase',
  'cv',
  'about',
  'contact',
] as const

export type DeskItemId = (typeof deskItemIds)[number]
