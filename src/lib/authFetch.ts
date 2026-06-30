export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("admin_token");
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure Content-Type is set if body is string (JSON)
  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
     headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login"; // Redirect to login
  }

  return response;
};
