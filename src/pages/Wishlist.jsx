import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'
import Loading from '../components/Loading.jsx'
import { egp } from '../utils/format.js'

export default function Wishlist() {
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get(endpoints.wishlist.base)).data,
  })

  const remove = useMutation({
    mutationFn: async (productId) => (await api.delete(endpoints.wishlist.item(productId))).data,
    onSuccess: () => {
      toast.success('Removed from wishlist')
      qc.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  if (isLoading) return <Loading />
  if (isError) return <div className="alert alert-warning">Wishlist not available or you need to login.</div>

  const items = data?.data ?? data?.data?.data ?? []

  return (
    <>
      <Helmet>
        <title>FreshCart | Wishlist</title>
      </Helmet>

      <div className="bg-main-light p-4 rounded-3">
        <h2 className="mb-3">Wishlist</h2>

        {items.length === 0 ? (
          <div className="text-muted">No items in wishlist.</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {items.map((p) => (
              <div key={p._id} className="d-flex gap-3 align-items-center border-bottom pb-3">
                <img
                  src={p.imageCover}
                  alt={p.title}
                  width="90"
                  height="90"
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
                <div className="flex-grow-1">
                  <Link to={`/products/${p._id}`} className="fw-semibold text-decoration-none">
                    {p.title}
                  </Link>
                  <div className="text-main">{egp(p.price)}</div>
                </div>

                <button className="btn btn-outline-danger btn-sm" onClick={() => remove.mutate(p._id)}>
                  <i className="fa-solid fa-trash me-2" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
