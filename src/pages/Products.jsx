import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import Loading from '../components/Loading.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { ProductsSkeletonGrid } from '../components/Skeletons.jsx'

export default function Products({ embedded = false }) {
  const [q, setQ] = useState('')
  const debouncedQ = useDebouncedValue(q, 450)

  const [page, setPage] = useState(1)
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')

  const queryClient = useQueryClient()

  const limit = embedded ? 8 : 20

  const productsQuery = useQuery({
    queryKey: ['products', { page, limit, debouncedQ, categoryId, brandId }],
    queryFn: async () => {
      // Most Route e-commerce backends support: page, limit, keyword, category, brand.
      // If your backend ignores some params, it will still return products.
      const params = {
        page,
        limit,
        ...(debouncedQ ? { keyword: debouncedQ } : {}),
        ...(categoryId ? { category: categoryId } : {}),
        ...(brandId ? { brand: brandId } : {}),
      }

      const res = await api.get(endpoints.products.all, { params })
      return res.data
    },
    placeholderData: (prev) => prev,
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get(endpoints.categories.all)).data,
    enabled: !embedded,
    staleTime: 1000 * 60 * 10,
  })

  const brandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: async () => (await api.get(endpoints.brands.all)).data,
    enabled: !embedded,
    staleTime: 1000 * 60 * 10,
  })

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get(endpoints.wishlist.base)).data,
    staleTime: 1000 * 60,
    retry: 0,
  })

  const addToCart = useMutation({
    mutationFn: async (productId) => (await api.post(endpoints.cart.base, { productId })).data,
    onSuccess: () => {
      toast.success('Added to cart')
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Please login first'),
  })

  const addToWishlist = useMutation({
    mutationFn: async (productId) => (await api.post(endpoints.wishlist.base, { productId })).data,
    onSuccess: () => {
      toast.success('Added to wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  const removeFromWishlist = useMutation({
    mutationFn: async (productId) => (await api.delete(endpoints.wishlist.item(productId))).data,
    onSuccess: () => {
      toast.success('Removed from wishlist')
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  const productsRaw = productsQuery.data
  const products = productsRaw?.data ?? productsRaw?.data?.data ?? []
  const meta = productsRaw?.metadata ?? productsRaw?.paginationResult ?? {}
  const numberOfPages = meta?.numberOfPages || meta?.totalPages || 1

  const wishlistItems = wishlistQuery.data?.data ?? wishlistQuery.data?.data?.data ?? []
  const wishSet = useMemo(() => new Set((wishlistItems || []).map((x) => x._id)), [wishlistItems])

  // If backend doesn't support keyword filtering, keep client-side filtering as fallback
  const finalList = useMemo(() => {
    if (!debouncedQ) return products
    if (productsQuery.isLoading) return products
    // If API already filtered, result is small and fine. If not, this will filter locally.
    const s = debouncedQ.trim().toLowerCase()
    return products.filter((p) =>
      [p.title, p.description, p.category?.name, p.brand?.name].some((x) =>
        String(x || '').toLowerCase().includes(s),
      ),
    )
  }, [products, debouncedQ, productsQuery.isLoading])

  function resetAndGo(setter, value) {
    setter(value)
    setPage(1)
  }

  function toggleWishlist(productId) {
    if (wishSet.has(productId)) removeFromWishlist.mutate(productId)
    else addToWishlist.mutate(productId)
  }

  if (productsQuery.isLoading) return embedded ? <Loading /> : <ProductsSkeletonGrid />
  if (productsQuery.isError) return <div className="alert alert-danger">Failed to load products.</div>

  return (
    <>
      {!embedded && (
        <Helmet>
          <title>FreshCart | Products</title>
        </Helmet>
      )}

      {!embedded && (
        <div className="d-flex flex-column gap-3 mb-3">
          <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between">
            <h3 className="mb-0">Products</h3>
            <input
              className="form-control"
              style={{ maxWidth: 420 }}
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="d-flex flex-column flex-md-row gap-2">
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => resetAndGo(setCategoryId, e.target.value)}
            >
              <option value="">All categories</option>
              {(categoriesQuery.data?.data ?? []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={brandId}
              onChange={(e) => resetAndGo(setBrandId, e.target.value)}
            >
              <option value="">All brands</option>
              {(brandsQuery.data?.data ?? []).map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setQ('')
                setCategoryId('')
                setBrandId('')
                setPage(1)
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {productsQuery.isFetching && !productsQuery.isLoading && !embedded && (
        <div className="small text-muted mb-2">Updating…</div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {finalList.map((p) => (
          <ProductCard
            key={p._id}
            p={p}
            onAddToCart={(id) => addToCart.mutate(id)}
            isAdding={addToCart.isPending}
            onToggleWishlist={toggleWishlist}
            isWishlisted={wishSet.has(p._id)}
          />
        ))}
      </div>

      {!embedded && numberOfPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button
            className="btn btn-outline-success"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span className="fw-semibold">
            Page {page} / {numberOfPages}
          </span>

          <button
            className="btn btn-outline-success"
            disabled={page >= numberOfPages}
            onClick={() => setPage((p) => Math.min(numberOfPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}
