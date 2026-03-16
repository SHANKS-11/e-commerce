import { Helmet } from 'react-helmet-async'
import errorImg from '../assets/404.png'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>FreshCart | 404</title>
      </Helmet>

      <div className="text-center py-5">
        <img src={errorImg} alt="404" className="img-fluid" style={{ maxHeight: 360 }} />
        <div className="mt-3 text-muted">Page not found</div>
      </div>
    </>
  )
}
