import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import logo from '../assets/luffy-logo.svg'
import { useAuth } from '../hooks/useAuth.js'
import { useTheme } from '../hooks/useTheme.js'
import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'

export default function Navbar() {
  const { isAuthed, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await api.get(endpoints.cart.base)).data,
    enabled: isAuthed,
    staleTime: 1000 * 30,
  })

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get(endpoints.wishlist.base)).data,
    enabled: isAuthed,
    staleTime: 1000 * 60,
    retry: 0,
  })

  const cartCount = cartData?.numOfCartItems ?? cartData?.data?.products?.length ?? 0
  const wishCount = wishlistData?.count ?? wishlistData?.data?.length ?? wishlistData?.data?.data?.length ?? 0

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="FreshCart" height="50" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="nav">
          {isAuthed && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">Products</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categories">Categories</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/brands">Brands</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center gap-2" to="/wishlist">
                  Wishlist
                  {wishCount > 0 && <span className="badge bg-success">{wishCount}</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center gap-2" to="/cart">
                  Cart
                  {cartCount > 0 && <span className="badge bg-success">{cartCount}</span>}
                </NavLink>
              </li>
            </ul>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={toggle}
                aria-label="Toggle theme"
              >
                {isDark ? <i className="fa-solid fa-sun" /> : <i className="fa-solid fa-moon" />}
              </button>
            </li>

            <li className="nav-item d-none d-lg-flex align-items-center gap-2">
              <a className="text-muted" href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
              <a className="text-muted" href="#" aria-label="Facebook"><i className="fa-brands fa-facebook" /></a>
              <a className="text-muted" href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok" /></a>
              <a className="text-muted" href="#" aria-label="Twitter"><i className="fa-brands fa-twitter" /></a>
              <a className="text-muted" href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin" /></a>
              <a className="text-muted" href="#" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
            </li>

            {!isAuthed ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/register">Register</NavLink></li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>SignOut</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
