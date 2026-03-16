import { Link } from 'react-router-dom'
import { egp } from '../utils/format.js'

export default function ProductCard({ p, onAddToCart, isAdding, onToggleWishlist, isWishlisted }) {
  return (
    <div className="col">
      <div className="product p-2 h-100 rounded-3 border position-relative">
        <button
          type="button"
          className={`btn btn-sm position-absolute top-0 end-0 m-2 ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'}`}
          style={{ zIndex: 2 }}
          onClick={() => onToggleWishlist?.(p._id)}
          aria-label="Toggle wishlist"
        >
          <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart`} />
        </button>

        <Link to={`/products/${p._id}`} className="d-block text-decoration-none">
          <img
            loading="lazy"
            src={p.imageCover}
            alt={p.title}
            className="w-100 rounded"
            style={{ height: 220, objectFit: 'cover' }}
          />
          <div className="mt-2">
            <div className="text-main font-sm">{p.category?.name}</div>
            <h6 className="mb-1 text-truncate">{p.title}</h6>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">{egp(p.price)}</span>
              <span className="d-flex align-items-center gap-1">
                <i className="fa-solid fa-star rating-color" />
                <span className="font-sm">{p.ratingsAverage?.toFixed?.(1) ?? p.ratingsAverage}</span>
              </span>
            </div>
          </div>
        </Link>

        <button
          className="btn bg-main text-white w-100 mt-2"
          onClick={() => onAddToCart?.(p._id)}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : '+ add to cart'}
        </button>
      </div>
    </div>
  )
}
