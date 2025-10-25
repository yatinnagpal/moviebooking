🎬 Movie Booking Backend — Django REST API

This is the backend service for the Movie Booking app, built using Django and Django REST Framework.
It provides REST APIs for user authentication, movies, showtimes, and bookings.

⚙️ Tech Stack

Python 3.10 +

Django 5 +

Django REST Framework

SQLite (default DB)

Virtualenv (recommended)

📂 Project Structure
backend/
├── core/                # Django project settings and URLs
├── userauth/            # Handles registration & login
├── movie_service/       # Movies model and API endpoints
├── showtime_service/    # Showtimes model and API endpoints
├── booking_service/     # Bookings model and API endpoints
├── api/                 # Unified API router
├── manage.py
└── requirements.txt

🧩 Setup Instructions

1️⃣ Clone Repo

git clone https://github.com/yatinnagpal/moviebooking.git
cd moviebooking/backend


2️⃣ Create and Activate Virtual Env

python3 -m venv .venv
source .venv/bin/activate      # Windows → .venv\Scripts\activate


3️⃣ Install Dependencies

pip install -r requirements.txt


4️⃣ Run Migrations

python manage.py migrate


5️⃣ Create Superuser

python manage.py createsuperuser


6️⃣ Run Server

python manage.py runserver


App runs at 👉 http://127.0.0.1:8000/

🧠 API Overview
Endpoint	Method	Description
/api/movies/	GET, POST	Fetch or add movies
/api/showtimes/	GET, POST	View or create showtimes
/api/bookings/	GET, POST	List or create bookings
/api/register/	POST	Register user
/api/login/	POST	Login user
🧪 Run Tests
python manage.py test

⚠️ Troubleshooting
Issue	Solution
App not found	Add app name in INSTALLED_APPS
Migration errors	Delete db.sqlite3 + __pycache__ → rerun migrations
CORS error	Install and enable django-cors-headers
💡 Tips

Use .env for secrets (django-environ)

Add .venv and db.sqlite3 to .gitignore

Switch to PostgreSQL in core/settings.py easily