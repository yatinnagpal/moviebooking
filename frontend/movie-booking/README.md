🎬 Movie Booking Frontend — React + Material UI

Frontend of the Movie Booking app, built with React 18+ and Material UI v5.
Users can browse movies, view showtimes and book tickets through a modern UI.

⚙️ Tech Stack

React 18 +

Material UI v5

Axios

React Router DOM

Prettier + ESLint

📂 Folder Structure
frontend/movie-booking/
├── src/
│   ├── components/       # UI components
│   ├── pages/            # Pages (Movies, Showtimes etc.)
│   ├── api/              # Axios instance
│   ├── config.js         # Backend API base URL
│   ├── App.js
│   └── index.js
├── public/
├── package.json
└── README.md

🧩 Setup Instructions

1️⃣ Move to Frontend Folder

cd frontend/movie-booking


2️⃣ Install Dependencies

npm install


3️⃣ Start Development Server

npm start


App runs at 👉 http://localhost:3000

🔗 Backend Connection

Default backend URL:

http://127.0.0.1:8000/api/


To change, edit src/config.js:

export const API_BASE_URL = "http://localhost:8000/api";

🎯 Features

✅ Browse and search movies
✅ View showtimes by movie
✅ Book tickets with dynamic form
✅ Snackbar notifications for feedback
✅ Responsive Material UI design

⚠️ Troubleshooting
Issue	Fix
App not starting	Delete node_modules → npm install again
Backend not reachable	Update API_BASE_URL in config.js
Snackbar not showing	Ensure component is mounted in parent
Styling off	Restart dev server
🌱 Future Enhancements

JWT auth (frontend login/register)

Pagination and filters on movie list

Seat selection UI

Dark mode support