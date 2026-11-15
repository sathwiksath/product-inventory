from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
    price: float = Field(..., ge=0, description="Unit price, must be >= 0")
    quantity: int = Field(..., ge=0, description="Units in stock, must be >= 0")


class ProductCreate(ProductBase):
    """Input schema for POST /products."""


class ProductUpdate(ProductBase):
    """Input schema for PUT /products/{id} (full replacement)."""


class ProductOut(ProductBase):
    """Output schema returned by every endpoint."""

    model_config = ConfigDict(from_attributes=True)

    id: int
