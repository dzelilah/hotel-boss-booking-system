export function PageLoading({ label = 'Učitavanje…' }: { label?: string }) {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <div className="spinner" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
