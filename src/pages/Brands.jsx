import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'
import Loading from '../components/Loading.jsx'

export default function Brands() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => (await api.get(endpoints.brands.all)).data,
  })

  if (isLoading) return <Loading />
  if (isError) return <div className="alert alert-danger">Failed to load brands.</div>

  const brands = data?.data || []

  return (
    <>
      <Helmet>
        <title>FreshCart | Brands</title>
      </Helmet>

      <h3 className="mb-3">Brands</h3>

      <div className="row row-cols-2 row-cols-md-4 g-3">
        {brands.map((b) => (
          <div className="col" key={b._id}>
            <div className="border rounded-3 p-3 h-100 d-flex flex-column align-items-center justify-content-center">
              <img src={b.image} alt={b.name} style={{ height: 80, objectFit: 'contain' }} className="w-100" />
              <div className="mt-2 fw-semibold">{b.name}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
