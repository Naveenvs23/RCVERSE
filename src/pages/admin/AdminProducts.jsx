import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createProductRecord,
  deleteProductRecord,
  fetchProducts,
  updateProductRecord,
} from "../../store/slices/productsSlice";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminModal,
  AdminPagination,
  AdminTable,
  ConfirmDialog,
  AdminLoadingState,
} from "../../components/admin/AdminPrimitives";
import ProductForm from "../../components/admin/ProductForm";
import { money } from "./adminUtils";
import "./AdminProducts.css";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editing, setEditing] = useState(undefined);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");
  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [dispatch, status]);
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );
  const save = async (product) => {
    setBusy(true);
    setApiError("");
    try {
      if (editing)
        await dispatch(
          updateProductRecord({ id: editing.id, changes: product }),
        ).unwrap();
      else {
        await dispatch(createProductRecord(product)).unwrap();
        setPage(1);
      }
      setEditing(undefined);
    } catch (failure) {
      setApiError(failure?.message || "Unable to save the product.");
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setBusy(true);
    try {
      await dispatch(deleteProductRecord(deleting.id)).unwrap();
      setDeleting(null);
      setPage((value) =>
        Math.min(value, Math.max(1, Math.ceil((items.length - 1) / pageSize))),
      );
    } catch (failure) {
      setApiError(failure?.message || "Unable to delete the product.");
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  };
  const columns = [
    {
      key: "product",
      label: "Product",
      render: (item) => (
        <div className="admin-product-cell">
          <img src={item.image} alt="" />
          <strong>{item.name}</strong>
        </div>
      ),
    },
    { key: "sku", label: "SKU" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", render: (item) => money(item.price) },
    { key: "stock", label: "Stock" },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="admin-action-row">
          <button
            aria-label={`Edit ${item.name}`}
            onClick={() => {
              setApiError("");
              setEditing(item);
            }}
          >
            <Pencil size={15} />
          </button>
          <button
            aria-label={`Delete ${item.name}`}
            onClick={() => setDeleting(item)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <h2>Products</h2>
          <p>{items.length} records from the product API.</p>
        </div>
        <button
          className="admin-button primary"
          onClick={() => {
            setApiError("");
            setEditing(null);
          }}
        >
          <Plus size={16} /> Add product
        </button>
      </div>
      {apiError && (
        <p className="admin-alert" role="alert">
          {apiError}
        </p>
      )}
      {status === "loading" && !items.length ? (
        <AdminLoadingState label="Loading products…" />
      ) : status === "failed" && !items.length ? (
        <AdminErrorState
          message={error}
          onRetry={() => dispatch(fetchProducts())}
        />
      ) : items.length === 0 ? (
        <AdminEmptyState
          title="No products in the catalogue."
          detail="Add a product to begin managing inventory."
        />
      ) : (
        <>
          <AdminTable columns={columns} rows={visible} />
          <AdminPagination
            page={currentPage}
            pageSize={pageSize}
            total={items.length}
            onPage={setPage}
            onPageSize={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}
      {editing !== undefined && (
        <AdminModal
          title={editing ? "Edit product" : "Add product"}
          onClose={() => !busy && setEditing(undefined)}
        >
          <ProductForm
            product={editing || null}
            busy={busy}
            apiError={apiError}
            onCancel={() => setEditing(undefined)}
            onSave={save}
          />
        </AdminModal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete product?"
          message={`Delete “${deleting.name}” from the catalogue? This change is saved to JSON Server.`}
          busy={busy}
          onCancel={() => !busy && setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </section>
  );
}
