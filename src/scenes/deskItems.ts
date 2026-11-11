export const deskItemIds = [
  'lolstats',
  'bracketly',
  'kumafy',
  'cv',
  'about',
  'contact',
] as const

export type DeskItemId = (typeof deskItemIds)[number]
