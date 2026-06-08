const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://educationportal-mce4.onrender.com/api";

const getToken = () => localStorage.getItem("authToken");

const buildHeaders = (isJson = true) => {
  const headers = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  const content = await response.json().catch(() => null);

  if (!response.ok) {
    const message = content?.message || `Server error: ${response.status}`;
    throw new Error(message);
  }

  return content;
};

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await handleResponse(response);
  } catch (error) {
    const message =
      error?.message === "Failed to fetch"
        ? "Unable to connect to the server. Please check backend deployment."
        : error?.message || "Network error";

    throw new Error(message);
  }
};

export const get = async (endpoint) =>
  apiFetch(endpoint, {
    method: "GET",
    headers: buildHeaders(true),
  });

export const post = async (endpoint, body, isFormData = false) =>
  apiFetch(endpoint, {
    method: "POST",
    headers: buildHeaders(!isFormData),
    body: isFormData ? body : JSON.stringify(body),
  });

export const put = async (endpoint, body) =>
  apiFetch(endpoint, {
    method: "PUT",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });

export const del = async (endpoint) =>
  apiFetch(endpoint, {
    method: "DELETE",
    headers: buildHeaders(true),
  });
