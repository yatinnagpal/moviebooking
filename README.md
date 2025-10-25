# Movie Booking — Fullstack App

Short summary

This repository contains a simple Movie Booking application with a Django REST API backend and a React frontend. It is organized as multiple small services/apps inside the `backend/` folder and a single React app in `frontend/movie-booking`.

Goal

Make it easy to run the full app locally for development, testing or demo purposes.

What this repo contains (high level)

- backend/ — Django project (API):
  - `core/` — Django project settings & URLs
  - `userauth/` — authentication (register, login, password reset)
  - `movie_service/` — movie models & endpoints
  - `showtime_service/` — showtime models & endpoints
  - `booking_service/` — booking models & endpoints
  - `api/` — (optional) API-level routing
  - `env/` — (optional) a virtualenv that may exist locally (should be ignored by git)

- frontend/movie-booking — React app (UI)

Prerequisites (basic)

- git
- Python 3.10+ (3.12 recommended)
- Node.js (v16+) and npm

Quick setup — run the backend and frontend locally

1) Clone the repo (if you haven't):

```bash
git clone <your-repo-url>
cd movie_booking
```

2) Backend (Django)

```bash
cd backend
# create a local venv (recommended name: .venv)
python3 -m venv .venv
source .venv/bin/activate
# install dependencies
pip install --upgrade pip
pip install -r requirements.txt
# apply DB migrations and create an admin user
python manage.py migrate
python manage.py createsuperuser
# start the API server
python manage.py runserver
```

The backend runs at http://127.0.0.1:8000/ by default.

3) Frontend (React)

Open a new terminal and from the repo root:

```bash
cd frontend/movie-booking
npm install
npm start
```

The frontend dev server runs at http://localhost:3000 and will connect to the backend API (edit `src/config.js` to change the backend base URL if needed).

Commands summary

- Start backend (terminal A):

```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

- Start frontend (terminal B):

```bash
cd frontend/movie-booking
npm start
```

Linting & formatting (optional)

Backend (format + lint):

```bash
cd backend
source .venv/bin/activate
pip install black isort ruff flake8
python -m isort .
python -m black . --line-length 88
python -m ruff check --fix --line-length 88 .
python -m flake8 . --max-line-length=88 --exclude=migrations,tests,env,venv,.venv
```

Frontend (format + lint):

```bash
cd frontend/movie-booking
npx prettier --write "src/**/*.{js,jsx,css}"
npx eslint --fix "src/**/*.{js,jsx}" --ext .js,.jsx
```

Database file & virtualenv cleanup

- If `backend/db.sqlite3` or `backend/env` are already tracked by git, remove them from tracking (this will not delete them from your disk):

```bash
# from repo root
git rm --cached backend/db.sqlite3
git rm -r --cached backend/env
git commit -m "Stop tracking local artifacts: db.sqlite3 and env"
git push
```

Tests

- Backend unit tests (Django):

```bash
cd backend
source .venv/bin/activate
python manage.py test
```

Notes & troubleshooting

- If the frontend cannot reach the backend, set the backend URL in `frontend/movie-booking/src/config.js`.
- The repository includes formatting + lint configs for both frontend and backend; run the commands above to keep code consistent.
- If you see ESLint or Flake8 errors coming from third-party packages (site-packages), those are probably from scanning your `env/` — make sure your virtualenv directory is excluded in lint checks and in `.gitignore`.

Next steps / optional improvements

- Add `pre-commit` hooks (recommended) to run `black`, `isort`, `ruff`, and Prettier on changed files.
- Use a `.env` file and `django-environ` for local secrets and email settings instead of editing `settings.py` directly.
- If you want `db.sqlite3` removed from the repository history, I can help run BFG or `git filter-repo` (this rewrites history and requires force-push).

If you'd like, I can commit this README and also run the git untracking commands for `db.sqlite3` and `backend/env` and push the changes. Tell me which you'd like me to do next.
