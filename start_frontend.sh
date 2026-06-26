#!/bin/bash
echo "Starting SpendSmart Frontend..."
cd "$(dirname "$0")/frontend"
npm install
npm run dev
