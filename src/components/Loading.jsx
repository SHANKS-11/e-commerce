export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="text-center">
        <div className="spinner-border text-success" role="status" />
        <div className="mt-2 text-muted">{text}</div>
      </div>
    </div>
  )
}
