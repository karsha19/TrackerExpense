#!/bin/bash
echo "Starting SpendSmart Backend..."
cd "$(dirname "$0")/backend"
pip install fastapi uvicorn sqlalchemy "python-jose[cryptography]" "passlib[bcrypt]" scikit-learn pandas python-multipart --break-system-packages -q
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
