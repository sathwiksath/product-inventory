import { useEffect, useState } from "react";

const EMPTY = { name: "", description: "", price: "", quantity: "" };

export default function ProductForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(
      editing
        ? {
            name: editing.name,
            description: editing.description ?? "",
            price: String(editing.price),
            quantity: String(editing.quantity),
          }
        : EMPTY
    );
  }, [editing]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const ok = await onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    });
    setSaving(false);
    if (ok && !editing) setForm(EMPTY);
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{editing ? `Edit product #${editing.id}` : "Add a product"}</h2>

      <label>
        Name
        <input value={form.name} onChange={update("name")} required maxLength={120} />
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={update("description")}
          rows={3}
          maxLength={1000}
        />
      </label>

      <div className="row">
        <label>
          Price ($)
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={update("price")}
            required
          />
        </label>
        <label>
          Quantity
          <input
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={update("quantity")}
            required
          />
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? "Saving…" : editing ? "Save changes" : "Add product"}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
