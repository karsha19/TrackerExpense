"""
Naive Bayes text classifier for expense category prediction.
Uses CountVectorizer + MultinomialNB from scikit-learn.
"""
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import pandas as pd

# ── Training data ─────────────────────────────────────────────────────────────
TRAINING_DATA = [
    # Food
    ("burger", "Food"), ("pizza", "Food"), ("dominos", "Food"),
    ("dominos pizza", "Food"), ("zomato", "Food"), ("swiggy", "Food"),
    ("restaurant", "Food"), ("cafe", "Food"), ("lunch", "Food"),
    ("dinner", "Food"), ("breakfast", "Food"), ("mcdonalds", "Food"),
    ("kfc", "Food"), ("biryani", "Food"), ("grocery", "Food"),
    ("vegetables", "Food"), ("fruits", "Food"), ("milk", "Food"),
    ("bread", "Food"), ("blinkit grocery", "Food"), ("zepto", "Food"),
    ("maggi", "Food"), ("tea", "Food"), ("coffee", "Food"),
    ("subway", "Food"), ("burger king", "Food"), ("haldirams", "Food"),

    # Travel
    ("uber", "Travel"), ("ola", "Travel"), ("rapido", "Travel"),
    ("uber ride", "Travel"), ("auto", "Travel"), ("bus ticket", "Travel"),
    ("train ticket", "Travel"), ("metro", "Travel"), ("flight", "Travel"),
    ("fuel", "Travel"), ("petrol", "Travel"), ("cab", "Travel"),
    ("taxi", "Travel"), ("irctc", "Travel"), ("makemytrip", "Travel"),
    ("goibibo", "Travel"), ("redbus", "Travel"), ("toll", "Travel"),
    ("parking", "Travel"), ("rapido bike", "Travel"),

    # Entertainment
    ("netflix", "Entertainment"), ("amazon prime", "Entertainment"),
    ("hotstar", "Entertainment"), ("spotify", "Entertainment"),
    ("movie ticket", "Entertainment"), ("movie", "Entertainment"),
    ("bookmyshow", "Entertainment"), ("concert", "Entertainment"),
    ("game", "Entertainment"), ("youtube premium", "Entertainment"),
    ("disney hotstar", "Entertainment"), ("jio cinema", "Entertainment"),
    ("zee5", "Entertainment"), ("sonyliv", "Entertainment"),
    ("bowling", "Entertainment"), ("amusement park", "Entertainment"),

    # Bills
    ("electricity bill", "Bills"), ("electricity", "Bills"),
    ("water bill", "Bills"), ("gas bill", "Bills"), ("internet bill", "Bills"),
    ("wifi", "Bills"), ("broadband", "Bills"), ("mobile recharge", "Bills"),
    ("phone bill", "Bills"), ("jio recharge", "Bills"), ("airtel", "Bills"),
    ("vodafone", "Bills"), ("bsnl", "Bills"), ("postpaid", "Bills"),
    ("maintenance", "Bills"), ("rent", "Bills"), ("insurance", "Bills"),
    ("emi", "Bills"), ("loan emi", "Bills"), ("society charges", "Bills"),

    # Shopping
    ("amazon", "Shopping"), ("flipkart", "Shopping"), ("myntra", "Shopping"),
    ("meesho", "Shopping"), ("ajio", "Shopping"), ("nykaa", "Shopping"),
    ("clothes", "Shopping"), ("shoes", "Shopping"), ("shirt", "Shopping"),
    ("jeans", "Shopping"), ("dress", "Shopping"), ("electronics", "Shopping"),
    ("mobile", "Shopping"), ("laptop", "Shopping"), ("headphones", "Shopping"),
    ("watch", "Shopping"), ("bag", "Shopping"), ("sunglasses", "Shopping"),

    # Health
    ("medicine", "Health"), ("doctor", "Health"), ("hospital", "Health"),
    ("pharmacy", "Health"), ("gym", "Health"), ("gym fees", "Health"),
    ("medical", "Health"), ("clinic", "Health"), ("dentist", "Health"),
    ("apollo pharmacy", "Health"), ("1mg", "Health"), ("pharmeasy", "Health"),
    ("yoga", "Health"), ("fitness", "Health"), ("health checkup", "Health"),

    # Education
    ("books", "Education"), ("course", "Education"), ("udemy", "Education"),
    ("coursera", "Education"), ("school fees", "Education"),
    ("college fees", "Education"), ("tuition", "Education"),
    ("stationery", "Education"), ("pen", "Education"), ("notebook", "Education"),
    ("byju", "Education"), ("unacademy", "Education"), ("exam fee", "Education"),
]

df = pd.DataFrame(TRAINING_DATA, columns=["description", "category"])

# ── Model pipeline ─────────────────────────────────────────────────────────────
_pipeline = Pipeline([
    ("vectorizer", CountVectorizer(ngram_range=(1, 2), lowercase=True)),
    ("classifier", MultinomialNB()),
])
_pipeline.fit(df["description"], df["category"])

CATEGORIES = sorted(df["category"].unique().tolist())

def predict(description: str) -> str:
    """Predict expense category from a description string."""
    result = _pipeline.predict([description.lower()])
    return result[0]
