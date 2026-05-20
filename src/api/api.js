const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    const message = content?.message || "Server error";
    throw new Error(message);
  }

  return content;
};

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return handleResponse(response);
  } catch (error) {
    const message =
      error?.message === "Failed to fetch"
        ? "Unable to connect to the server. Please make sure the backend is running."
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
