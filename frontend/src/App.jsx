import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import ProductForm from "./components/ProductForm.jsx";
import ProductTable from "./components/ProductTable.jsx";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setProducts(await api.list());
      setError("");
    } catch (e) {
      setError(`Could not reach the API: ${e.message}. Is the backend running on :8000?`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(data) {
    try {
      if (editing) {
        const updated = await api.update(editing.id, data);
        setProducts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
        setEditing(null);
      } else {
        const created = await api.create(data);
        setProducts((ps) => [...ps, created]);
      }
      setError("");
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await api.remove(product.id);
      setProducts((ps) => ps.filter((p) => p.id !== product.id));
      if (editing?.id === product.id) setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  }

  const stats = useMemo(
    () => ({
      count: products.length,
      units: products.reduce((s, p) => s + p.quantity, 0),
      value: products.reduce((s, p) => s + p.price * p.quantity, 0),
      low: products.filter((p) => p.quantity < 5).length,
    }),
    [products]
  );

  return (
    <div className="page">
      <header className="header">
        <h1>Product Inventory</h1>
        <p className="muted">FastAPI + SQLite backend, React frontend</p>
      </header>

      <section className="stats">
        <Stat label="Products" value={stats.count} />
        <Stat label="Units in stock" value={stats.units} />
        <Stat
          label="Inventory value"
          value={stats.value.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        />
        <Stat label="Low stock (<5)" value={stats.low} warn={stats.low > 0} />
      </section>

      {error && (
        <div className="alert" role="alert">
          {error}
          <button className="link" onClick={() => setError("")}>Dismiss</button>
        </div>
      )}

      <main className="layout">
        <ProductTable
          products={products}
          loading={loading}
          editingId={editing?.id}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
        <ProductForm
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      </main>
    </div>
  );
}

function Stat({ label, value, warn }) {
  return (
    <div className={`card stat ${warn ? "warn" : ""}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
