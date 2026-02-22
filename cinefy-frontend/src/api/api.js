export const authFetch = async (url, options = {}) => {

  const isFormData = options.body instanceof FormData;

  const headers = {
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    ...(options.headers || {})
  };

  // Only set Content-Type if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return response;
};
