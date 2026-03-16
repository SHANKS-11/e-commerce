import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'
import Loading from '../components/Loading.jsx'
import { egp } from '../utils/format.js'

export default function Cart() {
  const queryClient = useQueryClient()
  const [address, setAddress] = useState({ details: '', phone: '', city: '' })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await api.get(endpoints.cart.base)).data,
  })

  const cart = data?.data
  const items = cart?.products || []
  const cartId = cart?._id

  const updateQty = useMutation({
    mutationFn: async ({ productId, count }) => (await api.put(endpoints.cart.item(productId), { count })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  const removeItem = useMutation({
    mutationFn: async (productId) => (await api.delete(endpoints.cart.item(productId))).data,
    onSuccess: () => {
      toast.success('Removed')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  const checkoutOnline = useMutation({
    mutationFn: async () => {
      const res = await api.get(endpoints.orders.checkoutSession(cartId), {
        params: { url: window.location.origin },
      })
      return res.data
    },
    onSuccess: (payload) => {
      const url =
        payload?.session?.url ||
        payload?.data?.session?.url ||
        payload?.data?.url ||
        payload?.url
      if (url) window.location.href = url
      else toast.success('Checkout session created (no redirect URL returned).')
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Checkout failed'),
  })

  const cashOrder = useMutation({
    mutationFn: async () => {
      const res = await api.post(endpoints.orders.cashOrder(cartId), {
        shippingAddress: address,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success('Order created')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Order failed'),
  })

  const canCheckout = useMemo(() => Boolean(cartId && items.length), [cartId, items.length])

  if (isLoading) return <Loading />
  if (isError) return <div className="alert alert-warning">Your cart is empty or you need to login.</div>

  return (
    <>
      <Helmet>
        <title>FreshCart | Cart</title>
      </Helmet>

      <div className="bg-main-light p-4 rounded-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h2 className="mb-1">Shop Cart :</h2>
            <div className="text-main">Total Cart Price : {egp(cart?.totalCartPrice || 0)}</div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-success"
              disabled={!canCheckout || checkoutOnline.isPending}
              onClick={() => checkoutOnline.mutate()}
              title="Pay online (Stripe)"
            >
              {checkoutOnline.isPending ? 'Redirecting…' : 'Checkout Online'}
            </button>
            <button
              className="btn btn-outline-success"
              disabled={!canCheckout || cashOrder.isPending}
              data-bs-toggle="collapse"
              data-bs-target="#cashOrder"
            >
              Cash Order
            </button>
          </div>
        </div>

        <div className="collapse mt-3" id="cashOrder">
          <div className="card card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <label className="form-label">Address details</label>
                <input
                  className="form-control"
                  value={address.details}
                  onChange={(e) => setAddress((a) => ({ ...a, details: e.target.value }))}
                  placeholder="Street, building, etc."
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">City</label>
                <input
                  className="form-control"
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  value={address.phone}
                  onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
                  placeholder="01xxxxxxxxx"
                />
              </div>
            </div>

            <button
              className="btn btn-success mt-3 align-self-start"
              disabled={!canCheckout || cashOrder.isPending}
              onClick={() => cashOrder.mutate()}
            >
              {cashOrder.isPending ? 'Creating…' : 'Place Cash Order'}
            </button>

            <div className="small text-muted mt-2">
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {items.length === 0 ? (
          <div className="text-muted">No items.</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {items.map((it) => (
              <div key={it._id} className="d-flex gap-3 align-items-center border-bottom pb-3">
                <img
                  src={it.product?.imageCover}
                  alt={it.product?.title}
                  width="90"
                  height="90"
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold">{it.product?.title}</div>
                  <div className="text-main">price : {egp(it.price)}</div>
                  <button className="btn btn-link p-0 text-danger" onClick={() => removeItem.mutate(it.product?._id)}>
                    <i className="fa-solid fa-trash me-2" />Remove
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => updateQty.mutate({ productId: it.product?._id, count: it.count + 1 })}
                  >
                    +
                  </button>
                  <span className="fw-semibold">{it.count}</span>
                  <button
                    className="btn btn-outline-success btn-sm"
                    disabled={it.count <= 1}
                    onClick={() => updateQty.mutate({ productId: it.product?._id, count: it.count - 1 })}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
