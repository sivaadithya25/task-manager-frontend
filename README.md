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
npm run build
Copy-Item .env.example .env
# Set VITE_API_URL=http://localhost:5000/api in .env for local development.
npm run dev
```

Vite prints the local frontend URL (normally `http://localhost:5173`). Create a production bundle with `npm run build`; preview it with `npm run preview`.

## Backend setup

Set up PostgreSQL and the API as described in the [backend repository](https://github.com/sivaadithya25/task-manager-api). In a separate terminal:

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
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

Vite reads `VITE_API_URL` from `.env` at startup/build time. Set the local value to `http://localhost:5000/api` for local development; set the actual HTTPS Render API URL in Vercel project settings. The Axios client uses this one base URL for all requests and displays a configuration error if it is missing. Do not expose server secrets in Vite environment variables; frontend variables are public in the built application. Production source contains no localhost API fallback.

## Production deployment

Deployment status: no public Vercel or Render URL is configured yet. Record the actual platform-assigned URLs here after deployment is confirmed:

- Public frontend URL: not deployed yet
- Backend API base URL: `https://YOUR-BACKEND-URL.onrender.com/api`

### Vercel

This repository is configured for Vercel's Vite preset. Import `sivaadithya25/task-manager-frontend` into Vercel and set the project root to the repository root. Use build command `npm run build` and output directory `dist`. Add `VITE_API_URL` with the deployed Render API URL ending in `/api`, then deploy. `vercel.json` rewrites frontend paths to `index.html` so React Router routes continue to work after refresh. Set the final Vercel production origin as the API's Render `CLIENT_URL` or include it in `CORS_ORIGIN`.

### Render API

Deploy `sivaadithya25/task-manager-api` as a Render Web Service with build command `npm install` and start command `npm start`. Create a Render PostgreSQL instance and configure `DATABASE_URL`, `NODE_ENV=production`, `JWT_SECRET`, and `CLIENT_URL` in the Render service environment. Initialize the hosted database with the API repository's `database/schema.sql`. See the backend [deployment and database setup](https://github.com/sivaadithya25/task-manager-api#render-deployment) for environment variable details and health checks.

The public Vercel URL, Render API URL, and hosted PostgreSQL status are not known until those services are created and deployed; do not infer a successful deployment from a local build.

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

The build checks production compilation. Full authentication and CRUD integration checks require the API and PostgreSQL to be running with a configured database and a registered user. When the API is stopped, API-driven screens show a connection error and a retry action rather than failing silently. After deployment, test registration, login, protected task CRUD, page refreshes on nested routes, CORS, and task ownership using two separate users.

## Screenshots

Add screenshots of the dashboard, task details, and mobile layout here after launching with a configured backend.

## GitHub repository

This frontend is maintained in [sivaadithya25/task-manager-frontend](https://github.com/sivaadithya25/task-manager-frontend). `.env` is ignored and must never be committed.

For future updates:

```powershell
git add .
git commit -m "Describe frontend change"
git push -u origin main
```
