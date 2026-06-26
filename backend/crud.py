from sqlalchemy.orm import Session
from collections import defaultdict
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not auth.verify_password(password, user.hashed_password):
        return None
    return user

def create_income(db: Session, income: schemas.IncomeCreate, user_id: int):
    db_income = models.Income(**income.dict(), user_id=user_id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

def get_incomes(db: Session, user_id: int):
    return db.query(models.Income).filter(models.Income.user_id == user_id).order_by(models.Income.date.desc()).all()

def create_expense(db: Session, expense: schemas.ExpenseCreate, user_id: int):
    db_expense = models.Expense(**expense.dict(), user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses(db: Session, user_id: int):
    return db.query(models.Expense).filter(models.Expense.user_id == user_id).order_by(models.Expense.date.desc()).all()

def get_dashboard(db: Session, user_id: int):
    incomes = get_incomes(db, user_id)
    expenses = get_expenses(db, user_id)
    total_income = sum(i.amount for i in incomes)
    total_expense = sum(e.amount for e in expenses)
    balance = total_income - total_expense
    
    cat_totals = defaultdict(float)
    for e in expenses:
        cat_totals[e.category] += e.amount
    
    breakdown = []
    for cat, amt in cat_totals.items():
        pct = (amt / total_expense * 100) if total_expense > 0 else 0
        breakdown.append(schemas.CategoryBreakdown(category=cat, amount=amt, percentage=round(pct, 1)))
    
    return schemas.Dashboard(
        total_income=total_income,
        total_expense=total_expense,
        balance=balance,
        category_breakdown=breakdown
    )

def delete_income(db: Session, income_id: int, user_id: int):
    item = db.query(models.Income).filter(models.Income.id == income_id, models.Income.user_id == user_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"ok": True}

def delete_expense(db: Session, expense_id: int, user_id: int):
    item = db.query(models.Expense).filter(models.Expense.id == expense_id, models.Expense.user_id == user_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"ok": True}
