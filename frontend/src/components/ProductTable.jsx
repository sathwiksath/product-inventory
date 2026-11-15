const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function ProductTable({ products, loading, editingId, onEdit, onDelete }) {
  if (loading) return <div className="card empty">Loading products…</div>;
  if (products.length === 0)
    return <div className="card empty">No products yet. Add one with the form.</div>;

  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th className="num">Price</th>
            <th className="num">Qty</th>
            <th aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className={p.id === editingId ? "selected" : ""}>
              <td className="muted">{p.id}</td>
              <td className="strong">{p.name}</td>
              <td className="muted desc">{p.description || "—"}</td>
              <td className="num">{money.format(p.price)}</td>
              <td className="num">
                <span className={`pill ${p.quantity === 0 ? "out" : p.quantity < 5 ? "low" : ""}`}>
                  {p.quantity}
                </span>
              </td>
              <td className="row-actions">
                <button className="btn small" onClick={() => onEdit(p)}>Edit</button>
                <button className="btn small danger" onClick={() => onDelete(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
