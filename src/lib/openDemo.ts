/** Opens the shared Book-a-demo modal from anywhere. Optionally pre-selects a plan. */
export function openDemo(plan?: string) {
  window.dispatchEvent(new CustomEvent('revora:book', { detail: { plan } }))
}

export const DEMO_EVENT = 'revora:book'
