# SpendSmart – Smart Expense Tracker

A full-stack expense tracking app with AI-powered category prediction.

## Tech Stack
- **Frontend**: React + Vite, Recharts (pie chart), React Router
- **Backend**: FastAPI, SQLite (via SQLAlchemy)
- **AI**: Scikit-learn, Naive Bayes, CountVectorizer (Pandas)
- **Auth**: JWT tokens, bcrypt password hashing

## Project Structure
```
expense-tracker/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── models.py        # SQLAlchemy DB models
│   ├── schemas.py       # Pydantic schemas
│   ├── crud.py          # DB operations
│   ├── auth.py          # JWT + bcrypt
│   ├── ml_model.py      # Naive Bayes classifier
│   ├── database.py      # SQLite connection
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── api.js           # Axios config
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx    # Stats + Pie Chart
│       │   ├── AddExpense.jsx   # AI suggestion
│       │   ├── AddIncome.jsx
│       │   └── Transactions.jsx
│       └── components/
│           └── Layout.jsx   # Sidebar nav
├── start_backend.sh
└── start_frontend.sh
```

## How to Run

### Terminal 1 — Backend
```bash
./start_backend.sh
# OR manually:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2 — Frontend
```bash
./start_frontend.sh
# OR manually:
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

## API Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /register | No | Create account |
| POST | /login | No | Get JWT token |
| GET | /me | Yes | Current user |
| POST | /income | Yes | Add income |
| GET | /income | Yes | List incomes |
| DELETE | /income/{id} | Yes | Delete income |
| POST | /expense | Yes | Add expense |
| GET | /expense | Yes | List expenses |
| DELETE | /expense/{id} | Yes | Delete expense |
| GET | /dashboard | Yes | Stats + breakdown |
| GET | /predict-category?description=... | No | AI prediction |

## AI Model – How It Works

The ML model lives in `backend/ml_model.py`:

1. **Training data**: ~80 labeled examples (description → category)
2. **Vectorizer**: `CountVectorizer` converts text to word count vectors
3. **Classifier**: `MultinomialNB` (Multinomial Naive Bayes)
4. **Pipeline**: Both steps combined via `sklearn.Pipeline`

```python
pipeline = Pipeline([
    ("vectorizer", CountVectorizer()),
    ("classifier", MultinomialNB()),
])
pipeline.fit(descriptions, categories)
category = pipeline.predict(["Dominos Pizza"])[0]  # → "Food"
```

Categories predicted: Food, Travel, Entertainment, Bills, Shopping, Health, Education

## Features
- ✅ Register / Login / Logout (JWT)
- ✅ Add Income (Amount, Source, Date)
- ✅ Add Expense (Amount, Description, Category, Date)
- ✅ Real-time AI category suggestion (debounced, 600ms)
- ✅ Dashboard with Income / Expense / Balance cards
- ✅ Pie chart showing expense breakdown by category
- ✅ Progress bars per category with percentages
- ✅ Transaction history with delete
- ✅ SQLite database (no setup needed)
