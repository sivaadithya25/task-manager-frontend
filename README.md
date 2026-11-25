# Taskflow — Task Manager Frontend

A responsive React task manager that connects to the existing WA-2 Node.js, Express, and PostgreSQL API. The application uses live API data; it does not include mock task data.

## Features

- Register and sign in using the existing API; persist the JWT and user between page refreshes.
- Protected dashboard and task routes, with expired-token handling.
- Live task listing, summary counts, title search, status filtering, detail view, create, update, and confirmed deletion.
- Clear loading, empty, not-found, validation, API, and network error states.
- Responsive navigation, task cards, forms, and layouts.

## Technology

React 18, Vite, JavaScript/JSX, React Router DOM, Axios, React Context API, CSS3, and Lucide React.

## Project structure

```text
task-manager-frontend/
├── public/
├── src/
│   ├── components/       # Navigation, task card/form, loading and error UI
│   ├── context/          # Authentication state and persistence
│   ├── pages/            # Login, registration, dashboard and task pages
│   ├── services/         # Axios client, interceptors and API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
└── package.json
```

## Requirements and installation

- Node.js 18 or newer
- The WA-2 API running at `http://localhost:5000` with PostgreSQL configured

From this directory:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Vite prints the local frontend URL (normally `http://localhost:5173`). Create a production bundle with `npm run build`; preview it with `npm run preview`.

## Backend setup

Set up PostgreSQL and the API as described in `../task-manager-api/README.md`. In a separate terminal:

```powershell
cd ..\task-manager-api
npm install
# Configure task-manager-api\.env and initialize PostgreSQL as described in its README.
npm start
```

The API starts only after it can connect to PostgreSQL. It listens on port 5000 by default.

The API's default CORS origins now include `http://localhost:3000` and Vite's `http://localhost:5173`. For another origin, set the API's `CORS_ORIGIN` environment variable to a comma-separated list of allowed origins.

## Environment configuration

`.env.example` contains:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Vite reads `VITE_API_URL` from `.env` at startup. The Axios client uses this one base URL for all requests. Do not expose server secrets in Vite environment variables; frontend variables are public in the built application.

## API contract

All endpoints are relative to `VITE_API_URL`. Authentication success returns `data.token` and `data.user`; registration returns `data.user`. Successful task endpoints use `data.tasks` for the list and `data.task` for a single task. Task fields include `id`, `title`, `description`, `status`, `user_id`, `created_at`, and `updated_at`. Errors return `success: false`, `message`, and `errors`.

| Method | Path | Auth | Frontend behavior |
|---|---|---:|---|
| POST | `/auth/register` | No | Register with `name`, `email`, `password` |
| POST | `/auth/login` | No | Login; stores `data.token` and `data.user` |
| GET | `/tasks` | Bearer JWT | Load current user's tasks |
| GET | `/tasks/:id` | Bearer JWT | Load task details |
| POST | `/tasks` | Bearer JWT | Create with `title`, `description`, `status` |
| PUT | `/tasks/:id` | Bearer JWT | Update task fields |
| DELETE | `/tasks/:id` | Bearer JWT | Delete after confirmation |

Supported task statuses are `pending`, `in_progress`, and `completed`. An Axios request interceptor attaches the saved token. An unauthorized task request clears the expired credentials and returns the user to the login flow.

## Testing

```powershell
npm run build
```

The build checks production compilation. Full authentication and CRUD integration checks require the API and PostgreSQL to be running with a configured database and a registered user. When the API is stopped, API-driven screens show a connection error and a retry action rather than failing silently.

## Screenshots

Add screenshots of the dashboard, task details, and mobile layout here after launching with a configured backend.

## Publish as a separate GitHub repository

Create a public GitHub repository named `task-manager-frontend`, then run these commands from this folder after reviewing the files:

```powershell
git init
git add .
git commit -m "Build responsive Task Manager frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-manager-frontend.git
git push -u origin main
```

Do not commit `.env`; `.gitignore` excludes it. The project is prepared for publishing but has not been pushed.
