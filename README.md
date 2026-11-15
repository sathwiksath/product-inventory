# Product Inventory (FastAPI + React)

```
product-inventory/
├── backend/
│   ├── app/
│   │   ├── database.py   # SQLite engine, session, get_db dependency
│   │   ├── models.py     # SQLAlchemy Product table
│   │   ├── schemas.py    # Pydantic input/output schemas
│   │   └── main.py       # FastAPI app, CORS, CRUD routes
│   ├── requirements.txt
│   └── test_api.py
└── frontend/
    ├── src/
    │   ├── api.js                    # fetch wrapper for the API
    │   ├── App.jsx                   # dashboard, state, stats
    │   ├── components/ProductTable.jsx
    │   ├── components/ProductForm.jsx
    │   └── index.css
    └── package.json
```

## Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API at http://localhost:8000, interactive docs at http://localhost:8000/docs.
`inventory.db` is created automatically on first start.

## Run the frontend (second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. To point at a different API URL, set `VITE_API_URL` in `frontend/.env`.

## Endpoints

| Method | Path             | Body            | Returns            |
|--------|------------------|-----------------|--------------------|
| GET    | /products        |                 | list of products   |
| GET    | /products/{id}   |                 | product or 404     |
| POST   | /products        | ProductCreate   | 201 + product      |
| PUT    | /products/{id}   | ProductUpdate   | updated product    |
| DELETE | /products/{id}   |                 | 204                |

Validation: `name` 1–120 chars, `price` ≥ 0, `quantity` integer ≥ 0. Invalid input returns 422.

## Tests

```bash
cd backend
pip install pytest httpx
python -m pytest test_api.py
```
