# PyMentor AI

A premium, modern AI-powered Python coding assistant. Ask programming questions, generate scripts, explain code line-by-line, debug runtime errors, audit complexity, or get progressive solving hints inside a side-by-side Monaco Editor workspace.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3, Monaco Editor, Lucide Icons, React Markdown
- **Backend**: FastAPI, Python 3.12, Uvicorn, SQLAlchemy (Async)
- **Database**: SQLite (via `aiosqlite`)
- **AI Model**: Google Gemini 2.0 Flash (via `google-genai` SDK)

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables in `.env`:
   ```env
   JWT_SECRET_KEY=generate-a-strong-random-key
   GEMINI_API_KEY=your-gemini-api-key-here
   DATABASE_URL=sqlite+aiosqlite:///./pymentor.db
   FRONTEND_URL=http://localhost:5173
   ```
   *Note: If no `GEMINI_API_KEY` is configured or if the placeholder is kept, PyMentor runs in **Demo Mode**, yielding pre-defined simulated coding responses so you can still fully test the UI.*
4. Start the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --port 8000
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to **[http://localhost:5173](http://localhost:5173)**.

---

## Directory Structure

```
pymentor/
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── ai_service.py    # Gemini API wrapper & Prompt engineering
│   │   ├── routers/
│   │   │   ├── auth.py          # User auth controller
│   │   │   ├── chat.py          # Chat CRUD controller
│   │   │   └── code.py          # Fast Code action controller
│   │   ├── config.py            # Pydantic configuration settings
│   │   ├── database.py          # SQLAlchemy connection lifecycle
│   │   ├── models.py            # SQLAlchemy DB models (SQLite tables)
│   │   ├── schemas.py           # Pydantic request/response validators
│   │   └── main.py              # FastAPI app launch, CORS, routes mapping
│   ├── requirements.txt         # Backend pip packages list
│   └── .env                     # Local configuration parameters
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # API interface with JWT inject interceptors
    │   ├── context/
    │   │   ├── AuthContext.jsx  # User session context
    │   │   └── ThemeContext.jsx # Dark/Light mode context
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ThemeToggle.jsx
    │   │   ├── Sidebar.jsx      # Scrollable history, search & edit rename
    │   │   ├── ChatMessage.jsx  # Markdown parser & custom CodeBlocks
    │   │   ├── CodeBlock.jsx    # Syntax highlighter with Copy/Apply
    │   │   ├── ChatInput.jsx    # Textarea with auto-resize and mode selector
    │   │   └── MonacoPanel.jsx  # Monaco python editor & tool shortcuts
    │   ├── pages/
    │   │   ├── Login.jsx        # Login panel with card-glowing effects
    │   │   ├── Register.jsx     # Registration form with validations
    │   │   ├── Dashboard.jsx    # Split-screen workspace coordinating code
    │   │   └── NotFound.jsx     # Sleek 404 page
    │   ├── App.jsx              # Router coordinates
    │   ├── main.jsx             # React mount
    │   └── index.css            # Tailwind + custom layout styles
    ├── tailwind.config.js       # Content path & color variables
    └── package.json             # NPM dependencies & task script definitions
```

---

## Key Features

1. **Relational Thread Histories**: Auto-saved message loops mapped under users so you can resume coding sessions anytime.
2. **Flexible AI Modes**: General conversation, automated python snippet generator, runtime error debugger, complexity optimizer, unit test writer, or progressive hints.
3. **Monaco Workspace**: Rich python environment displaying tab spacing, color decorators, and scroll utilities.
4. **Code Context Syncing**: Import code fragments directly from Monaco to Chat console, or inject AI-designed block snippets straight into the active editor via the **Apply Code** button.

---

## Deployment Guide

### Step 1 — Push to GitHub
The repository is already connected to GitHub. After making changes:
```bash
git add .
git commit -m "your message"
git push origin master
```

### Step 2 — Deploy Backend on Render (free)
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo and select the **`pymentor`** repository
3. Set **Root Directory** → `backend`
4. Set **Build Command** → `pip install -r requirements.txt`
5. Set **Start Command** → `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add **Environment Variables** in the Render dashboard:
   | Key | Value |
   |-----|-------|
   | `GEMINI_API_KEY` | Your key from [aistudio.google.com](https://aistudio.google.com/apikey) |
   | `JWT_SECRET_KEY` | Any long random string |
   | `DATABASE_URL` | `sqlite+aiosqlite:///./pymentor.db` |
   | `FRONTEND_URL` | Your Vercel URL (add after Step 3) |
7. Deploy — note your Render URL (e.g. `https://pymentor-api.onrender.com`)

> **Or** use the `render.yaml` Blueprint at the root of this repo for automated setup.

### Step 3 — Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the **`pymentor`** GitHub repo
3. Set **Root Directory** → `frontend`
4. Add **Environment Variable**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-render-app-name.onrender.com/api` |
5. Deploy — Vercel auto-detects Vite and uses the `vercel.json` SPA rewrite config.
6. Copy your Vercel URL and go back to Render → add it as `FRONTEND_URL` env var → re-deploy.
