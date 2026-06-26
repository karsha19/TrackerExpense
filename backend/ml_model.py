from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import Pipeline
import pandas as pd

# Training data
training_data = [
    # Food
    ("burger", "Food"), ("pizza", "Food"), ("dominos", "Food"), ("mcdonalds", "Food"),
    ("kfc", "Food"), ("subway", "Food"), ("swiggy", "Food"), ("zomato", "Food"),
    ("restaurant", "Food"), ("lunch", "Food"), ("dinner", "Food"), ("breakfast", "Food"),
    ("coffee", "Food"), ("chai", "Food"), ("biryani", "Food"), ("grocery", "Food"),
    ("milk", "Food"), ("vegetables", "Food"), ("fruits", "Food"), ("snacks", "Food"),
    ("maggi", "Food"), ("noodles", "Food"), ("bread", "Food"), ("eggs", "Food"),
    ("dosa", "Food"), ("idli", "Food"), ("paratha", "Food"), ("thali", "Food"),
    # Travel
    ("uber", "Travel"), ("ola", "Travel"), ("auto", "Travel"), ("taxi", "Travel"),
    ("bus ticket", "Travel"), ("train ticket", "Travel"), ("flight", "Travel"),
    ("metro", "Travel"), ("rapido", "Travel"), ("petrol", "Travel"), ("fuel", "Travel"),
    ("toll", "Travel"), ("parking", "Travel"), ("cab", "Travel"), ("rickshaw", "Travel"),
    # Entertainment
    ("netflix", "Entertainment"), ("amazon prime", "Entertainment"), ("hotstar", "Entertainment"),
    ("movie ticket", "Entertainment"), ("pvr", "Entertainment"), ("inox", "Entertainment"),
    ("spotify", "Entertainment"), ("youtube premium", "Entertainment"), ("game", "Entertainment"),
    ("concert", "Entertainment"), ("event", "Entertainment"), ("amusement park", "Entertainment"),
    # Bills
    ("electricity bill", "Bills"), ("water bill", "Bills"), ("internet bill", "Bills"),
    ("phone bill", "Bills"), ("gas bill", "Bills"), ("rent", "Bills"),
    ("broadband", "Bills"), ("wifi", "Bills"), ("recharge", "Bills"),
    ("insurance", "Bills"), ("emi", "Bills"), ("loan", "Bills"),
    # Shopping
    ("amazon", "Shopping"), ("flipkart", "Shopping"), ("myntra", "Shopping"),
    ("clothes", "Shopping"), ("shoes", "Shopping"), ("shirt", "Shopping"),
    ("pants", "Shopping"), ("dress", "Shopping"), ("mobile", "Shopping"),
    ("laptop", "Shopping"), ("electronics", "Shopping"), ("furniture", "Shopping"),
    ("appliance", "Shopping"), ("watch", "Shopping"), ("bag", "Shopping"),
    # Health
    ("medicine", "Health"), ("doctor", "Health"), ("hospital", "Health"),
    ("pharmacy", "Health"), ("gym", "Health"), ("yoga", "Health"),
    ("medical", "Health"), ("clinic", "Health"), ("dental", "Health"),
    ("chemist", "Health"), ("vitamins", "Health"), ("supplements", "Health"),
    # Education
    ("books", "Education"), ("course", "Education"), ("tuition", "Education"),
    ("school fees", "Education"), ("college fees", "Education"), ("stationery", "Education"),
    ("udemy", "Education"), ("coursera", "Education"), ("exam fee", "Education"),
]

df = pd.DataFrame(training_data, columns=["description", "category"])

pipeline = Pipeline([
    ("vectorizer", CountVectorizer()),
    ("classifier", MultinomialNB()),
])

pipeline.fit(df["description"], df["category"])

def predict(description: str) -> str:
    try:
        return pipeline.predict([description.lower()])[0]
    except Exception:
        return "Others"
