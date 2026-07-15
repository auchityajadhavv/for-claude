import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase, supabaseConfigured, OWNER_EMAIL } from '../lib/supabase'
import { useSession } from '../lib/useSession'
import './admin.css'

type Status = 'new' | 'contacted' | 'closed'
type DemoRequest = {
  id: string
  name: string
  venue: string | null
  email: string
  message: string | null
  plan: string | null
  status: Status
  created_at: string
}

const STATUSES: Status[] = ['new', 'contacted', 'closed']

export default function Dashboard() {
  const { session, loading } = useSession()
  const navigate = useNavigate()
  const [rows, setRows] = useState<DemoRequest[]>([])
  const [fetching, setFetching] = useState(true)
  const [err, setErr] = useState('')
  const [filter, setFilter] = useState<'all' | Status>('all')

  const email = session?.user?.email?.toLowerCase()
  const isOwner = !OWNER_EMAIL || email === OWNER_EMAIL

  useEffect(() => {
    const sb = supabase
    if (!sb || !session || !isOwner) return
    let live = true
    const load = async () => {
      setFetching(true)
      const { data, error } = await sb
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (!live) return
      if (error) setErr(error.message)
      else setRows((data as DemoRequest[]) || [])
      setFetching(false)
    }
    load()
    // realtime: new submissions appear without a refresh
    const ch = sb
      .channel('demo_requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'demo_requests' }, (p) => {
        setRows((r) => [p.new as DemoRequest, ...r])
      })
      .subscribe()
    return () => {
      live = false
      sb.removeChannel(ch)
    }
  }, [session, isOwner])

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 864e5
    return {
      total: rows.length,
      newCount: rows.filter((r) => r.status === 'new').length,
      week: rows.filter((r) => new Date(r.created_at).getTime() > weekAgo).length,
    }
  }, [rows])

  const shown = filter === 'all' ? rows : rows.filter((r) => r.status === filter)

  async function setStatus(id: string, status: Status) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)))
    await supabase?.from('demo_requests').update({ status }).eq('id', id)
  }

  async function signOut() {
    await supabase?.auth.signOut()
    navigate('/login')
  }

  // ---- gating ----
  if (!supabaseConfigured) {
    return (
      <AdminShell>
        <div className="dash__notice">
          <h1>Backend not connected</h1>
          <p>Add your Supabase keys (see <code>docs/DASHBOARD-SETUP.md</code>) to enable the owner console.</p>
          <Link to="/" className="btn btn-ghost">← Back to site</Link>
        </div>
      </AdminShell>
    )
  }
  if (loading) return <AdminShell><div className="dash__notice"><p className="mono">Loading…</p></div></AdminShell>
  if (!session) return <Navigate to="/login" replace />
  if (!isOwner) {
    return (
      <AdminShell>
        <div className="dash__notice">
          <h1>Not authorised</h1>
          <p>This console is owner-only. You’re signed in as {email}.</p>
          <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <header className="dash__head">
        <div>
          <span className="eyebrow">Owner console</span>
          <h1 className="dash__title">Demo requests</h1>
        </div>
        <div className="dash__headActions">
          <span className="mono dash__who">{email}</span>
          <button className="btn btn-ghost dash__signout" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <div className="dash__stats">
        <Stat label="Total requests" value={stats.total} />
        <Stat label="New / unactioned" value={stats.newCount} accent />
        <Stat label="This week" value={stats.week} />
      </div>

      <div className="dash__toolbar">
        <div className="dash__filters">
          {(['all', ...STATUSES] as const).map((f) => (
            <button
              key={f}
              className={`dash__filter ${filter === f ? 'is-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {err && <p className="auth__error">{err}</p>}

      {fetching ? (
        <p className="mono dash__empty">Loading requests…</p>
      ) : shown.length === 0 ? (
        <p className="mono dash__empty">No requests here yet.</p>
      ) : (
        <div className="dash__tableWrap">
          <table className="dash__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Venue</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Message</th>
                <th>When</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id}>
                  <td data-th="Name">{r.name}</td>
                  <td data-th="Venue">{r.venue || '—'}</td>
                  <td data-th="Email"><a href={`mailto:${r.email}`}>{r.email}</a></td>
                  <td data-th="Plan">{r.plan || '—'}</td>
                  <td data-th="Message" className="dash__msg">{r.message || '—'}</td>
                  <td data-th="When" className="mono">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td data-th="Status">
                    <select
                      className={`dash__status is-${r.status}`}
                      value={r.status}
                      onChange={(e) => setStatus(r.id, e.target.value as Status)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  )
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      <div className="admin__inner">{children}</div>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`dash__stat ${accent ? 'is-accent' : ''}`}>
      <span className="dash__statValue">{value}</span>
      <span className="dash__statLabel mono">{label}</span>
    </div>
  )
}
