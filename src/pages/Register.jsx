import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', rePassword: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (form.password !== form.rePassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post(endpoints.auth.signup, form)
      toast.success('Account created')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>FreshCart | Register</title>
      </Helmet>

      <h2 className="mb-3">Register Now :</h2>

      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label">name :</label>
          <input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>

        <div>
          <label className="form-label">email :</label>
          <input className="form-control" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>

        <div>
          <label className="form-label">password :</label>
          <input className="form-control" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required />
        </div>

        <div>
          <label className="form-label">rePassword :</label>
          <input className="form-control" type="password" value={form.rePassword} onChange={(e) => set('rePassword', e.target.value)} required />
        </div>

        <div>
          <label className="form-label">phone :</label>
          <input className="form-control" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn bg-main text-white" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </div>
      </form>
    </>
  )
}
