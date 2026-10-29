import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { callAdmin, clearAdminToken, getAdminToken } from '../../lib/adminApi'

export default function AdminLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isLogin = pathname === '/admin'

  if (isLogin) return <Outlet />
  if (!getAdminToken()) return <Navigate to="/admin" replace />

  const logout = async () => {
    await callAdmin('logout').catch(() => undefined)
    clearAdminToken()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ivory text-umber">
      <header className="border-b border-umber/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-8">
            <Link to="/admin/products" className="font-serif text-lg uppercase tracking-[0.25em]">
              La&nbsp;Lumière
            </Link>
            <span className="text-[11px] tracking-[0.2em] text-smoke">后台管理</span>
            <Link
              to="/admin/products"
              className="text-[12px] tracking-[0.15em] text-umber/80 transition-colors hover:text-umber"
            >
              商品管理
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-[12px] tracking-[0.15em] text-umber/70 transition-colors hover:text-umber"
            >
              返回网站
            </Link>
            <button
              onClick={logout}
              className="text-[12px] tracking-[0.15em] text-umber/70 transition-colors hover:text-umber"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <Outlet />
      </main>
    </div>
  )
}
