import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function Auth() {
  const { signIn, signUp, user } = useAuth()
  const { lang } = useLang()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/shop'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate(redirect, { replace: true })
  }, [user, navigate, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password)

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else if (mode === 'signup') {
      // After signup, Supabase auto-signs in (email confirmation OFF)
      navigate(redirect, { replace: true })
    } else {
      navigate(redirect, { replace: true })
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <Link
            to="/"
            className="font-serif text-xl uppercase tracking-[0.28em]"
          >
            La&nbsp;Lumière
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-[0.4em] text-bronze">
            {lang === 'zh'
              ? mode === 'signin'
                ? '欢迎回来'
                : '创建账户'
              : mode === 'signin'
                ? 'Welcome back'
                : 'Create your account'}
          </p>
        </div>

        <div className="mb-8 flex border-b border-umber/15">
          <button
            onClick={() => { setMode('signin'); setError('') }}
            className={`flex-1 pb-3 text-[11px] uppercase tracking-[0.3em] transition-colors ${
              mode === 'signin'
                ? 'border-b border-bronze text-umber'
                : 'text-smoke hover:text-umber'
            }`}
          >
            {lang === 'zh' ? '登录' : 'Sign In'}
          </button>
          <button
            onClick={() => { setMode('signup'); setError('') }}
            className={`flex-1 pb-3 text-[11px] uppercase tracking-[0.3em] transition-colors ${
              mode === 'signup'
                ? 'border-b border-bronze text-umber'
                : 'text-smoke hover:text-umber'
            }`}
          >
            {lang === 'zh' ? '注册' : 'Sign Up'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-smoke">
              {lang === 'zh' ? '邮箱' : 'Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-umber/20 bg-transparent py-3 text-sm tracking-wide focus:border-bronze focus:outline-none"
              placeholder={lang === 'zh' ? '你的邮箱@地址.com' : 'your@address.com'}
            />
          </div>
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-smoke">
              {lang === 'zh' ? '密码' : 'Password'}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-umber/20 bg-transparent py-3 text-sm tracking-wide focus:border-bronze focus:outline-none"
              placeholder={lang === 'zh' ? '至少6位' : 'At least 6 characters'}
            />
          </div>

          {error && (
            <p className="text-center text-xs text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-umber py-4 text-[11px] uppercase tracking-[0.35em] text-ivory transition-colors duration-500 hover:bg-golddeep disabled:opacity-60"
          >
            {loading
              ? lang === 'zh'
                ? '请稍候…'
                : 'Please wait…'
              : mode === 'signin'
                ? lang === 'zh'
                  ? '登录'
                  : 'Sign In'
                : lang === 'zh'
                  ? '创建账户'
                  : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-light tracking-wide text-smoke">
          {lang === 'zh'
            ? '注册即代表你同意接收品牌通讯，可随时退订。'
            : 'By creating an account you agree to receive maison communications, unsubscribable at any time.'}
        </p>
      </div>
    </section>
  )
}
