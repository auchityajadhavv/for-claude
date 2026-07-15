import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEMO_EVENT } from '../lib/openDemo'
import './DemoModal.css'

// cheap env check so the marketing bundle never statically pulls in supabase-js
const backendConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)

type Errors = Partial<Record<'name' | 'venue' | 'email', string>>
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

/**
 * The one Book-a-demo form. Mounted once; any CTA opens it via the `revora:book`
 * event (optionally with a plan). No backend yet — on submit it confirms and,
 * in Phase 3, will POST to the demo-request endpoint.
 */
export default function DemoModal() {
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<string | undefined>()
  const [form, setForm] = useState({ name: '', venue: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const firstField = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // open on the shared event
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { plan?: string } | undefined
      setPlan(detail?.plan)
      setForm({ name: '', venue: '', email: '', message: '' })
      setErrors({})
      setStatus('idle')
      setOpen(true)
    }
    window.addEventListener(DEMO_EVENT, onOpen)
    return () => window.removeEventListener(DEMO_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    setTimeout(() => firstField.current?.focus(), 60)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const validate = (): boolean => {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Tell us who to reach.'
    if (!form.venue.trim()) next.venue = 'Which venue is this for?'
    if (!form.email.trim()) next.email = 'We need an email to reply to.'
    else if (!emailOk(form.email)) next.email = 'That email doesn’t look right.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const [submitError, setSubmitError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return
    setStatus('submitting')
    try {
      if (backendConfigured) {
        // lands in the owner dashboard (demo_requests table) — loaded on demand
        const { supabase } = await import('../lib/supabase')
        if (!supabase) throw new Error('Backend unavailable.')
        const { error } = await supabase.from('demo_requests').insert({
          name: form.name.trim(),
          venue: form.venue.trim(),
          email: form.email.trim(),
          message: form.message.trim() || null,
          plan: plan || null,
        })
        if (error) throw error
      } else {
        await new Promise((r) => setTimeout(r, 700))
      }
      setStatus('done')
    } catch (err) {
      setStatus('idle')
      setSubmitError((err as Error).message || 'Could not send. Please try again.')
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k as keyof Errors]) setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  if (!open) return null

  return createPortal(
    <div className="dm__overlay" role="dialog" aria-modal="true" aria-label="Book a demo" onClick={() => setOpen(false)}>
      <div className="dm__card" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="dm__close" aria-label="Close" onClick={() => setOpen(false)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>

        {status === 'done' ? (
          <div className="dm__done">
            <span className="dm__check" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 13.5 11 18l9-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h3 className="dm__doneTitle">Thanks, {form.name.split(' ')[0] || 'there'}.</h3>
            <p className="dm__doneBody">
              We’ll be in touch within a day to set up your first Revora stand
              {plan ? ` on the ${plan} plan` : ''}. Keep an eye on {form.email}.
            </p>
            <button className="btn btn-primary dm__doneBtn" onClick={() => setOpen(false)}>Done</button>
          </div>
        ) : (
          <>
            <span className="eyebrow dm__eyebrow">Book a demo</span>
            <h3 className="dm__title">Place your first stand this week.</h3>
            <p className="dm__sub">Tell us where it’s going and we’ll take it from there. No cost, no commitment.</p>
            {plan && <span className="dm__plan mono">Plan · {plan}</span>}

            <form className="dm__form" onSubmit={submit} noValidate>
              <Field label="Your name" error={errors.name}>
                <input ref={firstField} value={form.name} onChange={set('name')} autoComplete="name" placeholder="Priya Sharma" />
              </Field>
              <Field label="Venue name" error={errors.venue}>
                <input value={form.venue} onChange={set('venue')} autoComplete="organization" placeholder="Lumière Bistro" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input value={form.email} onChange={set('email')} type="email" autoComplete="email" inputMode="email" placeholder="you@venue.com" />
              </Field>
              <Field label="Anything we should know? (optional)">
                <textarea value={form.message} onChange={set('message')} rows={2} placeholder="Number of counters, timing, questions…" />
              </Field>

              {submitError && <p className="dm__error" role="alert">{submitError}</p>}
              <button className="btn btn-primary dm__submit" type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending…' : 'Request my demo'}
              </button>
              <p className="dm__fine mono">We only use this to set up your demo.</p>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={`dm__field ${error ? 'has-error' : ''}`}>
      <span className="dm__label">{label}</span>
      {children}
      {error && <span className="dm__error" role="alert">{error}</span>}
    </label>
  )
}
