# august — frontend

A fall-themed React chat interface for the "august" chatbot backend (Flask + LangChain + Gemini + Firebase).

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy the env template and fill in your values:
   ```
   cp .env.example .env
   ```

   - `VITE_API_BASE_URL` — your Flask backend URL (e.g. `http://localhost:5000` locally, your Render URL in production)
   - `VITE_FIREBASE_*` — from Firebase Console -> Project settings -> General -> "Your apps" -> SDK setup and configuration (the **web app** config, not the service account). This is the client-safe config, distinct from `firebase-admin.json` used by the backend.

   If you don't have a web app registered in Firebase yet: Firebase Console -> Project settings -> scroll to "Your apps" -> click the `</>` (web) icon -> register an app -> copy the config values shown.

3. Run locally:
   ```
   npm run dev
   ```

## How auth works here

Login and signup happen entirely client-side via the Firebase Auth JS SDK (`firebase/auth`) — this app does **not** call the backend's `/auth/signup` route. The Firebase `uid` from the client session is used directly as the `user_id` sent to `/chat` and `/chat/history/<user_id>`.

## Build

```
npm run build
```
Outputs to `dist/`.
