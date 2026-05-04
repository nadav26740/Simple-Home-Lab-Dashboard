#!/bin/bash

# Exit on error
set -e

# Go to project root (adjust path if needed)
cd "$(dirname "$0")"

# Activate virtual environment
source venv/bin/activate

# Run FastAPI
exec uvicorn app.main:app --host 0.0.0.0 --port 3000