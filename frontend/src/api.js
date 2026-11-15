const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") message = body.detail;
      else if (Array.isArray(body.detail))
        message = body.detail.map((d) => `${d.loc.at(-1)}: ${d.msg}`).join("; ");
    } catch {
      /* no JSON body */
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  list: () => request("/products"),
  get: (id) => request(`/products/${id}`),
  create: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};
