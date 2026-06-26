from pydantic import BaseModel
from typing import Optional, List, Dict

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class IncomeCreate(BaseModel):
    amount: float
    source: str
    date: str

class IncomeOut(BaseModel):
    id: int
    amount: float
    source: str
    date: str
    class Config:
        from_attributes = True

class ExpenseCreate(BaseModel):
    amount: float
    description: str
    category: str
    date: str

class ExpenseOut(BaseModel):
    id: int
    amount: float
    description: str
    category: str
    date: str
    class Config:
        from_attributes = True

class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float

class Dashboard(BaseModel):
    total_income: float
    total_expense: float
    balance: float
    category_breakdown: List[CategoryBreakdown]
