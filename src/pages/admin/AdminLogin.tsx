import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { callAdmin, errorText, getAdminToken, setAdminToken } from '../../lib/adminApi'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (getAdminToken()) return <Navigate to="/admin/products" replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = await callAdmin<{ token?: unknown }>('login', { username, password })
      if (typeof body.token !== 'string') throw new Error('登录失败，请重试')
      setAdminToken(body.token)
      navigate('/admin/products', { replace: true })
    } catch (err) {
      setError(errorText(err))
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border-b border-umber/20 bg-transparent py-3 text-sm focus:border-bronze focus:outline-none'

  return (
    <section className="flex min-h-screen items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-serif text-xl uppercase tracking-[0.28em] text-umber">
          La&nbsp;Lumière
        </p>
        <p className="mt-4 text-center text-[11px] tracking-[0.3em] text-bronze">后台管理登录</p>

        <form onSubmit={submit} className="mt-12 space-y-8">
          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.15em] text-umber/70">账号</span>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.15em] text-umber/70">密码</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          {error && <p className="text-center text-xs text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-umber py-4 text-[11px] uppercase tracking-[0.35em] text-ivory transition-colors duration-500 hover:bg-golddeep disabled:opacity-60"
          >
            {loading ? '登录中…' : '登录'}
          </button>
        </form>
      </div>
    </section>
  )
}
