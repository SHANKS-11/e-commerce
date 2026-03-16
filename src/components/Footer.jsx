export default function Footer() {
  return (
    <footer className="bg-main-light mt-5 py-4 border-top">
      <div className="container">
        <h5 className="mb-1">Get the FreshCart app</h5>
        <p className="text-muted mb-3">We will send you a link, open it on your phone to download the app.</p>

        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-8">
            <input className="form-control" placeholder="Email .." />
          </div>
          <div className="col-12 col-md-4 d-grid">
            <button className="btn bg-main text-white">Share App Link</button>
          </div>
        </div>

        <hr className="my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="text-muted">
            <span className="me-2">Payment Partners</span>
            <i className="fa-brands fa-cc-visa me-2" />
            <i className="fa-brands fa-cc-mastercard me-2" />
            <i className="fa-brands fa-cc-amex me-2" />
            <i className="fa-brands fa-paypal" />
          </div>
          <div className="text-muted">
            Get deliveries with FreshCart{' '}
            <span className="ms-2">
              <i className="fa-brands fa-apple me-2" />
              <i className="fa-brands fa-google-play" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
