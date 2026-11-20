export const showToast = (detail) => window.dispatchEvent(new CustomEvent("rcverse:toast", { detail }));
