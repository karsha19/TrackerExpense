from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud, auth, ml_model
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Expense Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = auth.decode_token(token)
    if user_id is None:
        raise credentials_exception
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user=Depends(get_current_user)):
    return current_user

@app.post("/income", response_model=schemas.IncomeOut)
def add_income(income: schemas.IncomeCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.create_income(db=db, income=income, user_id=current_user.id)

@app.get("/income", response_model=List[schemas.IncomeOut])
def get_incomes(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_incomes(db=db, user_id=current_user.id)

@app.post("/expense", response_model=schemas.ExpenseOut)
def add_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.create_expense(db=db, expense=expense, user_id=current_user.id)

@app.get("/expense", response_model=List[schemas.ExpenseOut])
def get_expenses(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_expenses(db=db, user_id=current_user.id)

@app.get("/dashboard", response_model=schemas.Dashboard)
def get_dashboard(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_dashboard(db=db, user_id=current_user.id)

@app.get("/predict-category")
def predict_category(description: str):
    category = ml_model.predict(description)
    return {"category": category}

@app.delete("/income/{income_id}")
def delete_income(income_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.delete_income(db=db, income_id=income_id, user_id=current_user.id)

@app.delete("/expense/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.delete_expense(db=db, expense_id=expense_id, user_id=current_user.id)
