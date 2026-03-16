import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client.js'
import { endpoints } from '../api/endpoints.js'
import Loading from '../components/Loading.jsx'

export default function Categories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get(endpoints.categories.all)).data,
  })

  if (isLoading) return <Loading />
  if (isError) return <div className="alert alert-danger">Failed to load categories.</div>

  const cats = data?.data || []

  return (
    <>
      <Helmet>
        <title>FreshCart | Categories</title>
      </Helmet>

      <h3 className="mb-3">Categories</h3>

      <div className="row row-cols-2 row-cols-md-4 g-3">
        {cats.map((c) => (
          <div className="col" key={c._id}>
            <div className="border rounded-3 p-2 h-100">
              <img src={c.image} alt={c.name} className="w-100 rounded" style={{ height: 140, objectFit: 'cover' }} />
              <div className="mt-2 text-center fw-semibold">{c.name}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
