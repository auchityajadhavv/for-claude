import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured, OWNER_EMAIL } from '../lib/supabase'
import './admin.css'

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const isSignup = mode === 'signup'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')
    if (!emailOk(email)) return setError('Enter a valid email.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    // owner-only: block anyone who isn't the configured owner
    if (OWNER_EMAIL && email.trim().toLowerCase() !== OWNER_EMAIL) {
      return setError('This console is owner-only.')
    }
    if (!supabase) return setError('Backend not connected yet. Add the Supabase keys first.')

    setBusy(true)
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          // send any confirmation link back to the live dashboard, not localhost
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        })
        if (error) throw error
        if (data.session) navigate('/dashboard')
        else setNotice('Account created. Check your email to confirm, then sign in.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/dashboard')
      }
    } catch (err) {
      setError((err as Error).message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <Link to="/" className="auth__brand">
          <span className="auth__mark" aria-hidden="true" />
          <span className="auth__wm">REVORA</span>
        </Link>
        <h1 className="auth__title">{isSignup ? 'Create owner account' : 'Owner sign in'}</h1>
        <p className="auth__sub">
          {isSignup
            ? 'This creates the single account that runs Revora.'
            : 'Only the owner can access the console.'}
        </p>

        {!supabaseConfigured && (
          <div className="auth__banner">
            The backend isn’t connected yet. Add your Supabase keys (see docs/DASHBOARD-SETUP.md) to enable sign in.
          </div>
        )}

        <form className="auth__form" onSubmit={submit} noValidate>
          <label className="auth__field">
            <span>Email</span>
            <input type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} placeholder="you@revora.in" />
          </label>
          <label className="auth__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="auth__error" role="alert">{error}</p>}
          {notice && <p className="auth__notice">{notice}</p>}

          <button className="btn btn-primary auth__submit" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="auth__switch">
          {isSignup ? (
            <>Already set up? <Link to="/login">Sign in</Link></>
          ) : (
            <>First time? <Link to="/signup">Create the owner account</Link></>
          )}
        </p>
      </div>
    </div>
  )
}
