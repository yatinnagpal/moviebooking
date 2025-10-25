# Backend — Django API (simple setup)

Prerequisites

- Python 3.10+ (3.12 recommended)
- git

1) Create and activate a virtual environment (recommended):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

2) Install Python dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3) Create the database and admin user:

```bash
python manage.py migrate
python manage.py createsuperuser
```

4) Run the server:

```bash
python manage.py runserver
```

Open the API at http://127.0.0.1:8000/.

Run tests:

```bash
python manage.py test
```

Simple lint/format commands (optional):

```bash
pip install black isort ruff flake8
python -m isort .
python -m black . --line-length 88
python -m ruff check --fix --line-length 88 .
python -m flake8 . --max-line-length=88 --exclude=migrations,tests,env,venv,.venv
```

Notes about `db.sqlite3` and `env/` (virtualenv):

- The project uses SQLite by default; the file is `backend/db.sqlite3`.
- If `backend/db.sqlite3` or `backend/env` were accidentally committed, stop tracking them (this does not delete the files locally):

```bash
# from repo root
git rm --cached backend/db.sqlite3
git rm -r --cached backend/env
git commit -m "Stop tracking local artifacts: db.sqlite3 and env"
git push
```
