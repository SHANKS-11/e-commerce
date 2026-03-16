import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'
import toast from 'react-hot-toast'

import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'
import Loading from '../components/Loading.jsx'
import { egp } from '../utils/format.js'

export default function ProductDetails() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => (await api.get(endpoints.products.one(id))).data,
  })

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get(endpoints.wishlist.base)).data,
    staleTime: 1000 * 60,
    retry: 0,
  })

  const addToCart = useMutation({
    mutationFn: async () => (await api.post(endpoints.cart.base, { productId: id })).data,
    onSuccess: () => {
      toast.success('Added to cart')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Please login first'),
  })

  const addToWishlist = useMutation({
    mutationFn: async () => (await api.post(endpoints.wishlist.base, { productId: id })).data,
    onSuccess: () => {
      toast.success('Added to wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  const removeFromWishlist = useMutation({
    mutationFn: async () => (await api.delete(endpoints.wishlist.item(id))).data,
    onSuccess: () => {
      toast.success('Removed from wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  if (isLoading) return <Loading />
  if (isError) return <div className="alert alert-danger">Product not found.</div>

  const p = data?.data
  const settings = { dots: true, arrows: false, infinite: true, slidesToShow: 1, slidesToScroll: 1 }

  const wishlistItems = wishlistQuery.data?.data ?? wishlistQuery.data?.data?.data ?? []
  const isWishlisted = (wishlistItems || []).some((x) => x._id === id)

  return (
    <>
      <Helmet>
        <title>FreshCart | {p?.title || 'Product'}</title>
      </Helmet>

      <div className="row g-4 align-items-center">
        <div className="col-md-4">
          <Slider {...settings}>
            {(p?.images?.length ? p.images : [p?.imageCover]).filter(Boolean).map((src) => (
              <img key={src} src={src} className="w-100 rounded" style={{ height: 340, objectFit: 'cover' }} />
            ))}
          </Slider>
        </div>
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <h3 className="mb-2">{p.title}</h3>

            <button
              type="button"
              className={`btn btn-sm ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => (isWishlisted ? removeFromWishlist.mutate() : addToWishlist.mutate())}
              disabled={addToWishlist.isPending || removeFromWishlist.isPending}
            >
              <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart me-2`} />
              {isWishlisted ? 'Wishlisted' : 'Add to wishlist'}
            </button>
          </div>

          <p className="text-muted">{p.description}</p>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <div className="text-main">{p.category?.name}</div>
              <div className="text-muted">{p.brand?.name}</div>
            </div>
            <div className="text-end">
              <div className="fw-semibold">{egp(p.price)}</div>
              <div className="d-flex align-items-center justify-content-end gap-1">
                <i className="fa-solid fa-star rating-color" />
                <span>{p.ratingsAverage}</span>
              </div>
            </div>
          </div>

          <button className="btn bg-main text-white" onClick={() => addToCart.mutate()} disabled={addToCart.isPending}>
            {addToCart.isPending ? 'Adding...' : '+ add to cart'}
          </button>
        </div>
      </div>
    </>
  )
}
