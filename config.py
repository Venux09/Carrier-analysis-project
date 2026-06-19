import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "database", "chat_history.db")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# Groq model to use — llama-3.3-70b-versatile is fast and free on Groq
GROQ_MODEL = "llama-3.3-70b-versatile"

AI_SYSTEM_PROMPT = """You are the Carrier Codex career advisor.

Rules:
- Only answer questions related to careers: stream selection (Science/Commerce/Arts),
  job roles, skills, salaries, education paths, and career planning in India.
- If asked anything unrelated to careers, politely decline and redirect
  the conversation back to career topics.
- Be honest and data-grounded. Avoid generic motivational fluff.
- Keep responses concise and practical.
"""