import type { Content } from './types'
const tok = () => localStorage.getItem('tk') || ''
async function req<T>(url: string, opts: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) headers.Authorization = 'Bearer ' + tok()
  const r = await fetch(url, { ...opts, headers })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw Object.assign(new Error(j.error || 'Request failed'), { status: r.status })
  return j as T
}
export interface Message { id: number; name: string; email: string; phone: string; company: string; type: string; message: string; date: string }
export interface TestimonialSubmission { id: number; quote: string; name: string; position: string; company: string; date: string }
export const api = {
  content: () => req<Partial<Content>>('/api/content'),
  send: (b: Record<string, string>) => req('/api/contact', { method: 'POST', body: JSON.stringify(b) }),
  submitTestimonial: (b: Record<string, string>) => req('/api/testimonials', { method: 'POST', body: JSON.stringify(b) }),
  login: (password: string) => req<{ token: string }>('/api/login', { method: 'POST', body: JSON.stringify({ password }) }),
  save: (key: string, value: unknown) => req('/api/admin/content/' + key, { method: 'PUT', body: JSON.stringify(value) }, true),
  upload: (data: string) => req<{ url: string }>('/api/admin/upload', { method: 'POST', body: JSON.stringify({ data }) }, true),
  password: (current: string, next: string) => req('/api/admin/password', { method: 'POST', body: JSON.stringify({ current, next }) }, true),
  messages: () => req<Message[]>('/api/admin/messages', {}, true),
  deleteMessage: (id: number) => req('/api/admin/messages/' + id, { method: 'DELETE' }, true),
  testimonialSubmissions: () => req<TestimonialSubmission[]>('/api/admin/testimonial-submissions', {}, true),
  approveTestimonial: (id: number) => req('/api/admin/testimonial-submissions/' + id + '/approve', { method: 'POST' }, true),
  rejectTestimonial: (id: number) => req('/api/admin/testimonial-submissions/' + id, { method: 'DELETE' }, true),
}