🎬 Movie Booking — Fullstack Web App

A complete Movie Booking platform built with Django REST Framework (backend) and React + Material UI (frontend).
Users can browse movies, view showtimes, and book tickets seamlessly.

🚀 Features
🎥 For Users

Browse all movies with details (poster, genre, duration, rating, description)

Search movies by title

View available showtimes for each movie

Book seats instantly via a sleek booking form

Get instant confirmation feedback via Snackbar alerts

⚙️ For Admins

Add, update, or delete movies

Create and manage showtimes per movie

View and manage bookings

🧱 Tech Stack
Layer	Technology
Frontend	React, Material UI, Axios
Backend	Django, Django REST Framework
Database	SQLite (default)
Other Tools	Virtualenv, npm, ESLint, Prettier
📂 Project Structure
moviebooking/
│
├── backend/                  # Django project
│   ├── core/                 # Project settings and URLs
│   ├── userauth/             # User authentication (register, login, password reset)
│   ├── movie_service/        # Movie model and API
│   ├── showtime_service/     # Showtime model and API
│   ├── booking_service/      # Booking model and API
│   ├── api/                  # API routing
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    └── movie-booking/        # React app
        ├── src/
        ├── public/
        └── package.json

⚙️ Setup Instructions
🧩 Prerequisites

Make sure you have installed:

Python 3.10+ (recommended: 3.12)

Node.js 16+ and npm

Git

🐍 Backend Setup (Django)
# Clone the repository
git clone https://github.com/yatinnagpal/moviebooking.git
cd moviebooking/backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate   # (Windows: .venv\Scripts\activate)

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations and create superuser
python manage.py migrate
python manage.py createsuperuser

# Start the backend server
python manage.py runserver


Backend will start at 👉 http://127.0.0.1:8000/

💻 Frontend Setup (React)

Open a new terminal:

cd frontend/movie-booking
npm install
npm start


Frontend will start at 👉 http://localhost:3000/

If the frontend can’t connect to the backend, update the API base URL inside:
frontend/movie-booking/src/config.js

🧪 Testing

Run backend tests:

cd backend
source .venv/bin/activate
python manage.py test

🧹 Linting & Formatting

Backend (Python):

pip install black isort ruff flake8
black . --line-length 88
isort .
ruff check --fix .
flake8 . --max-line-length=88 --exclude=migrations,env,venv


Frontend (JS/React):

npx prettier --write "src/**/*.{js,jsx,css}"
npx eslint --fix "src/**/*.{js,jsx}"

🗃️ Git Ignore Cleanup

If db.sqlite3 or backend/env got added to Git accidentally:

git rm --cached backend/db.sqlite3
git rm -r --cached backend/env
git commit -m "Stop tracking local artifacts"
git push

🛠️ Troubleshooting
Issue	Fix
Backend not reachable from frontend	Check API URL in src/config.js
Migration errors	Delete db.sqlite3 and __pycache__ folders, then rerun migrations
Static files not loading	Run python manage.py collectstatic
Snackbar not showing	Ensure MUI <Snackbar> is properly wrapped in parent container
🌱 Future Improvements

✅ JWT Authentication & Protected Routes

✅ Better Admin Dashboard (React-based)

🌐 Docker Compose setup

📱 Responsive mobile-first redesign