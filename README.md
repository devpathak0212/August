# August 🍂

A fall-themed AI chatbot with a Flask + LangChain + Gemini backend and a React frontend, with Firebase handling auth and chat history.

**Live app:** [_add your Vercel URL here_](https://august-the-chatbot.vercel.app/)

---

## Features

- Chat with "august," a Gemini-powered assistant (via LangChain)
- Email/password auth (Firebase Auth) with a username set at signup
- Persistent chat history per user (Firestore)
- Fall-themed UI with light/dark mode toggle
- Responsive, mobile-friendly design

## Tech stack

**Backend** — `backend/`
- Flask
- LangChain + `langchain-google-genai` (Gemini)
- Firebase Admin SDK (Auth + Firestore)
- Gunicorn (production server)

**Frontend** — `frontend/`
- React + Vite
- Firebase JS SDK (client-side auth)
- Plain CSS (no framework)

## Project structure

```
.
├── backend/          Flask API
│   ├── app.py
│   ├── chain.py       LangChain + Gemini setup
│   ├── firebase_service.py
│   ├── routes.py
│   └── requirements.txt
└── frontend/          React app
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── styles/
    │   ├── App.jsx
    │   ├── api.js
    │   └── firebase.js
    └── index.html
```

## Local setup

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
```

Add your Firebase **service account** key as `backend/firebase-admin.json` (Firebase Console → Project settings → Service accounts → Generate new private key). This file is gitignored and must never be committed.

Run it:
```bash
python app.py
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `frontend/.env` with your Firebase **web app** config (Firebase Console → Project settings → "Your apps" → the `</>` web icon) and your backend URL:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Run it:
```bash
npm run dev
```

> Note: login/signup happen entirely client-side via the Firebase Auth SDK. The Firebase `uid` is used directly as the `user_id` sent to the backend.

## API

| Method | Route | Body | Returns |
|---|---|---|---|
| GET | `/health` | — | `{status, service}` |
| POST | `/chat` | `{user_id, message}` | `{response}` |
| GET | `/chat/history/<user_id>` | — | `[{user, bot}, ...]` |
| POST | `/auth/signup` | `{email, password}` | `{uid, custom_id}` |

## Deployment

**Backend (Render)**
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`
- Env vars: `GEMINI_API_KEY`, `FIREBASE_CREDENTIALS_PATH=/etc/secrets/firebase-admin.json`
- Secret file: `firebase-admin.json` (your service account key)

**Frontend (Vercel)**
- Root directory: `frontend`
- Framework preset: Vite
- Env vars: same as `frontend/.env`, with `VITE_API_BASE_URL` set to your live Render URL

> The backend runs on Render's free tier, which spins down after ~15 minutes of inactivity. The first request after idle time can take 20–50 seconds to respond while it wakes back up — this is expected, not a bug.

## Security notes

- `backend/.env` and `backend/firebase-admin.json` are gitignored — never commit real credentials.
- The Firebase **web config** in `frontend/.env` (`apiKey`, `appId`, etc.) is safe to expose publicly — it identifies the project only; actual access control comes from Firebase Auth + Firestore security rules.
- The Firebase **service account** JSON (`firebase-admin.json`) is a secret and must stay server-side only.
