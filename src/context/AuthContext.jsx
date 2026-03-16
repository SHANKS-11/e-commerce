import React, { createContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    try {
      return token ? jwtDecode(token) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!token) {
      setUser(null)
      localStorage.removeItem('token')
      return
    }
    localStorage.setItem('token', token)
    try {
      setUser(jwtDecode(token))
    } catch {
      setUser(null)
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed: Boolean(token),
      login: (newToken) => setToken(newToken),
      logout: () => setToken(null),
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
