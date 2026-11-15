"""Quick smoke test: python -m pytest test_api.py (needs pytest + httpx)."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_crud_cycle():
    r = client.post("/products", json={"name": "Widget", "description": "A test",
                                        "price": 9.99, "quantity": 5})
    assert r.status_code == 201
    pid = r.json()["id"]

    assert any(p["id"] == pid for p in client.get("/products").json())
    assert client.get(f"/products/{pid}").json()["name"] == "Widget"

    r = client.put(f"/products/{pid}", json={"name": "Widget 2", "description": None,
                                              "price": 12.5, "quantity": 3})
    assert r.status_code == 200 and r.json()["price"] == 12.5

    assert client.delete(f"/products/{pid}").status_code == 204
    assert client.get(f"/products/{pid}").status_code == 404


def test_validation():
    r = client.post("/products", json={"name": "", "price": -1, "quantity": 1})
    assert r.status_code == 422


def test_cors_preflight():
    r = client.options("/products", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
    })
    assert r.headers["access-control-allow-origin"] == "http://localhost:5173"
