export function SkeletonBox({ height = 16, width = '100%', className = '' }) {
  return (
    <div
      className={`bg-light rounded ${className}`}
      style={{ height, width, opacity: 0.7 }}
    />
  )
}

export function ProductsSkeletonGrid({ count = 12 }) {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col">
          <div className="p-2 h-100 rounded-3 border">
            <SkeletonBox height={220} className="w-100" />
            <div className="mt-3">
              <SkeletonBox height={12} width="40%" />
              <SkeletonBox height={14} width="90%" className="mt-2" />
              <div className="d-flex justify-content-between mt-2">
                <SkeletonBox height={12} width="30%" />
                <SkeletonBox height={12} width="20%" />
              </div>
              <SkeletonBox height={36} className="mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
