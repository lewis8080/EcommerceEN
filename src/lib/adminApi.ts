const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-products`
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const TOKEN_KEY = 'lalumiere-admin-token'

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export class AdminApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function isSessionExpired(err: unknown) {
  return err instanceof AdminApiError && err.status === 401
}

export function errorText(err: unknown) {
  return err instanceof Error ? err.message : '操作失败，请重试'
}

export async function callAdmin<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<T> {
  let response: Response
  try {
    response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
        apikey: ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, token: getAdminToken() ?? undefined, ...payload }),
    })
  } catch {
    throw new AdminApiError('网络连接失败，请检查后重试', 0)
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && action !== 'login') clearAdminToken()
    throw new AdminApiError(body?.error ?? '操作失败，请重试', response.status)
  }

  return body as T
}
