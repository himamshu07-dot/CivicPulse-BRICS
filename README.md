# CivicPulse BRICS — Digital Public Good Platform

CivicPulse BRICS is an open, scalable, multilingual Digital Public Good platform architected to aggregate, analyze, and visualize cross-border civic infrastructure indicators, public sentiment, and open geospatial insights across BRICS member states.

---

## 🏛️ Architecture Overview

```
civicpulse-brics/
├── backend/                  # Python 3.11 + FastAPI Service
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── health.py # /health endpoint
│   │   ├── core/
│   │   │   ├── config.py     # Pydantic Settings & CORS
│   │   │   └── database.py   # Async SQLAlchemy + PostGIS engine
│   │   ├── __init__.py
│   │   └── main.py           # FastAPI application entry point
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/                 # Next.js 14 (App Router) + React + Tailwind CSS
│   ├── src/
│   │   └── app/
│   │       ├── globals.css   # Design system tokens
│   │       ├── layout.tsx    # Font bindings (Inter + Merriweather)
│   │       └── page.tsx      # Foundation starter & token showcase
│   ├── Dockerfile
│   ├── next.config.mjs
│   ├── package.json
│   ├── tailwind.config.js    # Global Trust & Action palette
│   └── tsconfig.json
├── docker-compose.yml        # Orchestrates PostGIS, Redis, FastAPI, Next.js
├── .env.example              # Root environment template
└── README.md
```

---

## 🎨 Frontend Design System ("Global Trust & Action")

The frontend is styled using Tailwind CSS configured with the following exact palette:

| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `background` | `#F8FAFC` | Main application canvas |
| `card` | `#FFFFFF` | Data cards & content containers |
| `primary` | `#1E293B` | Navigation, titles, and headers |
| `accent` | `#0F766E` | Primary interactive buttons & active states |
| `alert-critical` | `#E11D48` | Severe infrastructure hotspots / critical alerts |
| `alert-warn` | `#FBBF24` | Moderate attention hotspots / warning states |
| `text-main` | `#0F172A` | Primary body text |
| `text-muted` | `#64748B` | Secondary and metadata text |

### Typography
- **Primary UI Font**: `Inter` (sans-serif)
- **Report & Editorial Font**: `Merriweather` (serif)

---

## 🚀 Quick Start with Docker Compose

1. **Clone & Copy Environment Variables**:
   ```bash
   cp .env.example .env
   ```

2. **Spin Up All Services**:
   ```bash
   docker compose up --build
   ```

3. **Verify Service Endpoints**:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **FastAPI Health**: [http://localhost:8000/health](http://localhost:8000/health)
   - **FastAPI Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL / PostGIS**: `localhost:5432` (`civicpulse_db`)
   - **Redis**: `localhost:6379`

---

## 🛠️ Individual Service Development

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

---

## 🛡️ License
Digital Public Good — Open Source.
