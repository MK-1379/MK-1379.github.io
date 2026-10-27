const planeIcon = `<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M22 2 2 9.5l8 3.5 3.5 8L22 2Z" fill="var(--surface)"/><path d="m22 2-12 11"/></svg>`

export function launchPaperPlane(from: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = from.getBoundingClientRect()
  const plane = document.createElement('span')
  plane.className = 'paper-plane'
  plane.setAttribute('aria-hidden', 'true')
  plane.innerHTML = planeIcon
  plane.style.left = `${rect.left + rect.width / 2}px`
  plane.style.top = `${rect.top + rect.height / 2}px`
  document.body.append(plane)

  const flight = plane.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0.4) rotate(0deg)', opacity: 0 },
      {
        transform: 'translate(-50%, -50%) translate(0, -18px) scale(1) rotate(-8deg)',
        opacity: 1,
        offset: 0.12,
      },
      { transform: 'translate(-50%, -50%) translate(-46px, -70px) rotate(-70deg)', offset: 0.38 },
      { transform: 'translate(-50%, -50%) translate(10px, -120px) rotate(-200deg)', offset: 0.55 },
      {
        transform: 'translate(-50%, -50%) translate(120px, -150px) rotate(-345deg)',
        opacity: 1,
        offset: 0.75,
      },
      {
        transform: 'translate(-50%, -50%) translate(320px, -260px) rotate(-350deg) scale(0.7)',
        opacity: 0,
      },
    ],
    { duration: 1600, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
  )
  flight.onfinish = () => plane.remove()
  flight.oncancel = () => plane.remove()
}
