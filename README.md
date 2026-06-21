# Carrier Codex

**A data-driven career analytics platform for Indian students choosing between Science, Commerce, and Arts after Class 10th.**

Carrier Codex replaces guesswork-based stream selection with real research: salary ranges, market saturation, regret rates, stream-choice psychology, and career trajectories — pulled directly from hand-built Jupyter notebooks, not generic career-counselor talking points. It also includes an AI career advisor restricted strictly to career-related conversation.

---

## Table of Contents

1. [What This Project Is](#what-this-project-is)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Page-by-Page Breakdown](#page-by-page-breakdown)
5. [Data Pipeline — From Notebook to Browser](#data-pipeline--from-notebook-to-browser)
6. [The Chart Engine](#the-chart-engine)
7. [Setup & Installation](#setup--installation)
8. [Environment Variables](#environment-variables)
9. [Running Locally](#running-locally)
10. [The AI Chat Feature](#the-ai-chat-feature)
11. [Design System](#design-system)
12. [Known Limitations / Next Steps](#known-limitations--next-steps)

---

## What This Project Is

Right after Class 10th, Indian students are forced to pick a stream — Science, Commerce, or Arts — usually based on family opinion, peer pressure, or anecdotal "topper" stories rather than actual data. Carrier Codex exists to put real numbers in front of that decision: salary spreads, market saturation by career, regret statistics, and an honest breakdown of the psychology behind why students choose what they choose.

It is built around **four research notebooks** (`science_stream_second_page.ipynb`, `commerce_main_page.ipynb`, `arts.ipynb`, `decision.ipynb`), each containing markdown analysis, datasets, and matplotlib visualizations. The web app is a faithful, strictly-sourced translation of that research into an interactive site — no invented data was added on top of what the notebooks contain.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Flask 3.0 (Python) |
| Database | SQLite (chat history only) |
| Frontend | Plain HTML5, CSS3, vanilla JavaScript (no frontend framework) |
| Charts | Custom zero-dependency Canvas 2D chart engine (`charts.js`) — no Chart.js, no CDN |
| AI Chat | Groq API, `llama-3.3-70b-versatile` model |
| Data source | Four Jupyter notebooks, manually researched (pandas/matplotlib) |
| Fonts | Playfair Display, Crimson Pro, DM Mono (Google Fonts) |

---

## Folder Structure

```
carrier-codex/
│
├── app.py                     # Flask app — all routes + chat API
├── config.py                  # Constants, system prompt, Groq key loading
├── requirements.txt           # Python dependencies
├── .env                       # API key (never committed — see .gitignore)
├── .gitignore
│
├── static/
│   ├── css/
│   │   ├── base.css           # Fonts, colors, resets, nav/footer — shared everywhere
│   │   ├── home.css           # Hero morph, reveal cards, stream links
│   │   ├── stream.css         # Shared layout for science/commerce/arts pages
│   │   ├── about.css          # About page layout
│   │   └── chat.css           # Chat bubble UI
│   │
│   ├── js/
│   │   ├── sakura.js          # Falling petal canvas animation (every page)
│   │   ├── home.js            # Scroll-driven text morph + scroll-reveal cards
│   │   ├── charts.js          # Zero-dependency canvas chart engine (donut, bar, scatter)
│   │   ├── science.js         # Fetches science_data.json, renders Science charts
│   │   ├── commerce.js        # Fetches commerce_data.json, renders Commerce charts
│   │   ├── arts.js             # Fetches arts_data.json, renders Arts charts
│   │   └── chat.js            # AI Chat frontend (send/receive, typing indicator)
│   │
│   └── data/
│       ├── science_data.json   # Extracted from science_stream_second_page.ipynb
│       ├── commerce_data.json  # Extracted from commerce_main_page.ipynb
│       └── arts_data.json      # Extracted from arts.ipynb
│
├── templates/
│   ├── base.html               # Shared head/nav/footer, sakura canvas, Chart placeholder
│   ├── home.html
│   ├── science.html
│   ├── commerce.html
│   ├── arts.html
│   ├── about.html
│   └── chat.html
│
└── database/
    └── chat_history.db         # SQLite, auto-created at runtime (gitignored)
```

---

## Page-by-Page Breakdown

### `/` — Home
A full-viewport hero with the project name, then a scroll-driven text morph: **"Decide Your Career"** fades/blurs out while **"Career Analytics"** fades in as the user scrolls, controlled by `home.js` reading `window.scrollY` against a 500px morph range. Below that, three scroll-revealed cards (using `IntersectionObserver`) explain why the project exists, what it does, and who built it. The page ends with three stream link cards routing to Science, Commerce, and Arts.

### `/science` — Science Stream
Sourced strictly from `science_stream_second_page.ipynb`. Covers:
- India's subject-combination flexibility vs. UK/USA/Canada/Australia/Germany/Singapore (donut chart)
- PCM vs PCB vs PCMB salary spread — min/mid/peak (grouped bar)
- A togglable PCB/PCM career explorer showing current vs. projected salary per career (horizontal bar)
- Market saturation insights (aspirants vs. active professionals)
- "Normal Student vs Aware Student" effort-vs-outcome scatter comparison

### `/commerce` — Commerce Stream
Sourced strictly from `commerce_main_page.ipynb`. Covers:
- Stream distribution (Arts 45% / Science 35% / Commerce 20%) and why Commerce is the smallest
- Why students actually choose Commerce (fallback, exam-focused, math-escape, family business, genuine interest)
- Five myth-vs-reality breakdowns (the "fallback" fallacy, "easy stream" trap, AI-replacement fear, etc.)
- Traditional vs. modern Commerce career paths, scored across job security / salary growth / global mobility / remote work

### `/arts` — Arts Stream
Sourced strictly from `arts.ipynb`. Covers:
- Why students choose Arts (UPSC target, forced choice, math/science escape, law, passion)
- Three myth-vs-reality breakdowns (the "dumping ground" fallacy, "zero employability" myth, AI shift reality)
- Modern Arts+Tech hybrid careers (UX research, behavioral data science, conversational AI design, etc.) with growth scores
- Traditional Arts career paths and their saturation rates (UPSC has 99.9% attrition)

### `/about` — About the Maker
Information about the project creator, GitHub and LinkedIn links, the tech stack used, and quick links to every other page.

### `/chat` — AI Career Chat
A chat interface backed by Groq's `llama-3.3-70b-versatile`, restricted to career-advice-only conversation via the system prompt in `config.py`. Conversation history is persisted per-session in SQLite (`database/chat_history.db`).

---

## Data Pipeline — From Notebook to Browser

1. **Source of truth**: the four `.ipynb` notebooks contain markdown commentary, pandas dataframes, and matplotlib chart outputs.
2. **Extraction**: markdown cells and dataframe outputs were read directly out of each notebook's JSON structure and transcribed into clean JSON files — no numbers were invented or estimated beyond what the notebooks contained.
3. **Storage**: `static/data/{science,commerce,arts}_data.json` hold this data in a flat, frontend-friendly shape.
4. **Rendering**: each stream's dedicated JS file (`science.js`, `commerce.js`, `arts.js`) fetches its JSON on `DOMContentLoaded` and feeds it into the shared `CodexCharts` rendering functions, plus injects HTML for myth cards, insight bars, and career cards.

This means updating a chart or a stat is as simple as editing the relevant JSON file — no HTML/JS changes required for data updates.

---

## The Chart Engine

`static/js/charts.js` exposes a global `CodexCharts` object with four chart types: `donut`, `groupedBar`, `horizontalBar`, and `scatter`.

**Why no Chart.js?** The first version of this project loaded Chart.js from a CDN (`cdnjs.cloudflare.com`). In practice, charts failed to render — most likely due to the CDN request failing, being blocked, or loading too slowly/out-of-order relative to the page's own scripts. To make the project fully self-contained and immune to network issues, the entire charting layer was rewritten as **plain Canvas 2D drawing code** with zero external dependencies. Every chart — donut, bar, horizontal bar, scatter with trend line — is hand-drawn using `CanvasRenderingContext2D` primitives (`arc`, `fillRect`, `moveTo`/`lineTo`, etc.), styled to match the editorial dark/paper theme (ink `#1a1a1a`, paper `#fdfcfa`, mist `#d4cfc7`, plus each stream's accent color).

This also means: **no internet connection is required to view charts** once the page itself has loaded — a meaningful reliability improvement for demoing the project offline (e.g. during a presentation).

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- pip

### Steps

```bash
# 1. Clone or extract the project
cd carrier-codex

# 2. (Recommended) create a virtual environment
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt
```

`requirements.txt` contains:
```
Flask==3.0.3
groq==0.11.0
python-dotenv==1.0.1
```

---

## Environment Variables

The AI Chat feature needs a **free Groq API key**.

1. Go to [console.groq.com](https://console.groq.com) and sign up (free tier is sufficient).
2. Create an API key.
3. Open `.env` in the project root and paste it in:

```env
# Never commit this file. It is already in .gitignore.
GROQ_API_KEY=your_groq_api_key_here
```

If this is left unconfigured, the chat endpoint will not crash — it returns a friendly message telling the user the key hasn't been set yet, so the rest of the site remains fully usable without it.

---

## Running Locally

```bash
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

The SQLite database (`database/chat_history.db`) is created automatically on first run — no manual migration step needed.

---

## The AI Chat Feature

- **Model**: `llama-3.3-70b-versatile` via Groq's OpenAI-compatible chat completions API.
- **System prompt** (`config.py` → `AI_SYSTEM_PROMPT`): restricts the assistant strictly to career-related topics — stream selection, job roles, skills, salaries, education paths, and career planning in India. Off-topic questions are politely declined and redirected.
- **Persistence**: every user/assistant message pair is stored in the `chat_messages` table (`session_id`, `role`, `content`, `created_at`), keyed by a randomly generated browser session ID (`chat.js`).
- **API surface**:
  - `POST /api/chat/send` — send a message, get a reply, store both turns
  - `GET /api/chat/history/<session_id>` — retrieve a session's full history

---

## Design System

| Token | Value | Used for |
|---|---|---|
| `--ink` | `#1a1a1a` | Primary text, dark backgrounds (hero, nav, footer) |
| `--paper` | `#fdfcfa` | Page background |
| `--accent-sakura` | `#c75d6e` | Home page / petals / brand accent |
| `--accent-science` | `#1a6b6b` | Science page accent |
| `--accent-commerce` | `#b8923f` | Commerce page accent |
| `--accent-arts` | `#8b2635` | Arts page accent |
| Fonts | Playfair Display (headings), Crimson Pro (body/prose), DM Mono (labels/data) | Editorial, premium feel |

Every stream page shares the same `stream.css` layout skeleton (hero, data cards, insight bars, stat strips, toggle buttons) so the three pages feel like one consistent system rather than three separately designed pages — only the accent color and content change.

---

## Known Limitations / Next Steps

- The **Decision** notebook (`decision.ipynb`) — covering stream-selection psychology, regret rates, and the hybrid-career dataset — has not yet been built into its own page. Per the current plan, this content is slated to feed into either a dedicated "Decision" section or directly into the AI Chat's contextual knowledge.
- `about.html` currently has placeholder GitHub/LinkedIn URLs (`yourusername`) that need to be swapped for real profile links before deployment.
- No automated test suite yet — verification so far has been manual route-by-route testing (all six pages confirmed returning HTTP 200).
- The chat does not yet feed any of the stream datasets as context, so its advice is general LLM knowledge shaped by the system prompt, not grounded in the specific notebook numbers. Wiring `science_data.json` / `commerce_data.json` / `arts_data.json` into the chat context would let it answer with the project's exact data.

## Demo :-
https://github.com/user-attachments/assets/8da2f63c-e46e-4509-943e-6bc8a982256e
