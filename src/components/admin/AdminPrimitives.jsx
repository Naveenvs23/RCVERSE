import { useEffect } from "react";
import { AlertTriangle, LoaderCircle, X } from "lucide-react";

export function AdminLoadingState({ label = "Loading records…" }) {
  return (
    <div className="admin-state">
      <LoaderCircle className="admin-spinner" size={22} />
      {label}
    </div>
  );
}

export function AdminErrorState({ message, onRetry }) {
  return (
    <div className="admin-state admin-error-state">
      <AlertTriangle size={22} />
      <strong>Could not load data</strong>
      <span>{message}</span>
      {onRetry && (
        <button className="admin-button primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function AdminEmptyState({ title, detail }) {
  return (
    <div className="admin-empty">
      <strong>{title}</strong>
      {detail && <span>{detail}</span>}
    </div>
  );
}

export function AdminStatCard({ label, value, note }) {
  return (
    <article className="admin-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}

export function AdminPagination({ page, pageSize, total, onPage, onPageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="admin-pagination">
      <label>
        Rows{" "}
        <select
          value={pageSize}
          onChange={(event) => onPageSize(Number(event.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </label>
      <span>
        Page {Math.min(page, pages)} of {pages} · {total} records
      </span>
      <div>
        <button
          disabled={page <= 1}
          onClick={() => onPage(Math.max(1, page - 1))}
        >
          Previous
        </button>
        <button
          disabled={page >= pages}
          onClick={() => onPage(Math.min(pages, page + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function AdminModal({ title, onClose, children }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
  return (
    <div
      className="admin-modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <h2>{title}</h2>
          <button aria-label="Close dialog" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  onCancel,
  onConfirm,
  busy = false,
}) {
  return (
    <AdminModal title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="admin-form-actions">
        <button className="admin-button" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button
          className="admin-button danger"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Please wait…" : "Confirm"}
        </button>
      </div>
    </AdminModal>
  );
}

export function AdminTable({
  columns,
  rows,
  emptyTitle = "No records found.",
}) {
  if (!rows.length) return <AdminEmptyState title={emptyTitle} />;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
