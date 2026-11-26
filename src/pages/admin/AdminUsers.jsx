import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserBlockStatus,
} from "../../store/slices/usersSlice";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPagination,
  AdminTable,
} from "../../components/admin/AdminPrimitives";
import { dateLabel } from "./adminUtils";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.users);
  const admin = useSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [updatingId, setUpdatingId] = useState(null);
  const [apiError, setApiError] = useState("");
  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers());
  }, [dispatch, status]);
  const customers = items.filter(
    (user) => (user.role || "customer") !== "admin",
  );
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(customers.length / pageSize)),
  );
  const visible = useMemo(
    () => customers.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [customers, currentPage, pageSize],
  );
  const toggleBlocked = async (user) => {
    setUpdatingId(user.id);
    setApiError("");
    try {
      await dispatch(
        updateUserBlockStatus({ id: user.id, isBlocked: !user.isBlocked }),
      ).unwrap();
    } catch (failure) {
      setApiError(failure?.message || "Could not update the account.");
    } finally {
      setUpdatingId(null);
    }
  };
  const columns = [
    { key: "name", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "id", label: "User ID" },
    {
      key: "createdAt",
      label: "Created",
      render: (user) => dateLabel(user.createdAt),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <span className={`admin-status ${user.isBlocked ? "blocked" : "good"}`}>
          {user.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (user) => (
        <button
          className="admin-button"
          disabled={
            String(user.id) === String(admin?.id) || updatingId === user.id
          }
          onClick={() => toggleBlocked(user)}
        >
          {updatingId === user.id
            ? "Saving…"
            : user.isBlocked
              ? "Unblock"
              : "Block"}
        </button>
      ),
    },
  ];
  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <h2>Customers</h2>
          <p>
            Manage customer access. Passwords are never returned to this screen.
          </p>
        </div>
        <button className="admin-button" onClick={() => dispatch(fetchUsers())}>
          Refresh
        </button>
      </div>
      {apiError && (
        <p className="admin-alert" role="alert">
          {apiError}
        </p>
      )}
      {status === "loading" && !items.length ? (
        <AdminLoadingState label="Loading users…" />
      ) : status === "failed" && !items.length ? (
        <AdminErrorState
          message={error}
          onRetry={() => dispatch(fetchUsers())}
        />
      ) : customers.length === 0 ? (
        <AdminEmptyState title="No customer accounts found." />
      ) : (
        <>
          <AdminTable columns={columns} rows={visible} />
          <AdminPagination
            page={currentPage}
            pageSize={pageSize}
            total={customers.length}
            onPage={setPage}
            onPageSize={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </>
      )}
    </section>
  );
}
