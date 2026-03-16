import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'
import { useAuth } from '../hooks/useAuth.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post(endpoints.auth.signin, { email, password })
      const token = res.data?.token
      if (!token) throw new Error('No token returned')
      login(token)
      toast.success('Welcome back')
      navigate('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>FreshCart | Login</title>
      </Helmet>

      <h2 className="mb-3">Login Now :</h2>

      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label">email :</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>

        <div>
          <label className="form-label">password :</label>
          <input
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn bg-main text-white" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </div>
      </form>
    </>
  )
}
