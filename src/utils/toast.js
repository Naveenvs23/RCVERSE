// send a small browser event so any component can request a toast without
// importing or controlling the toast display component directly.
export const showToast = (detail) => window.dispatchEvent(new CustomEvent("rcverse:toast", { detail }));
