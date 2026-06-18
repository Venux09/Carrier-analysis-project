from flask import Flask, render_template, request, jsonify
import sqlite3
import os

try:
    import anthropic
except ImportError:
    anthropic = None

from config import AI_SYSTEM_PROMPT, DATABASE_PATH, ANTHROPIC_API_KEY

app = Flask(__name__)
client = (
    anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    if anthropic and ANTHROPIC_API_KEY
    else None
)


def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


init_db()


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/science")
def science():
    return render_template("science.html")


@app.route("/commerce")
def commerce():
    return render_template("commerce.html")


@app.route("/arts")
def arts():
    return render_template("arts.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/api/chat/history/<session_id>")
def chat_history(session_id):
    conn = get_db()
    rows = conn.execute(
        "SELECT role, content, created_at FROM chat_messages WHERE session_id = ? ORDER BY id ASC",
        (session_id,),
    ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/chat/send", methods=["POST"])
def chat_send():
    """
    Receives a user message, stores it, and returns the AI reply.
    NOTE: Plug in the actual model call where marked below.
    The system prompt restricts the assistant to career advice only.
    """
    data = request.get_json(force=True)
    session_id = data.get("session_id", "default")
    user_message = (data.get("message") or "").strip()

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
        (session_id, "user", user_message),
    )
    conn.commit()

    history_rows = conn.execute(
        "SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY id ASC",
        (session_id,),
    ).fetchall()

    # ---- MODEL CALL ----
    if client is None:
        reply_text = (
            "AI Chat isn't configured yet. Add your ANTHROPIC_API_KEY to the .env file "
            "in the project root, then restart the server."
        )
    else:
        api_messages = [
            {"role": r["role"], "content": r["content"]} for r in history_rows
        ]
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=600,
                system=AI_SYSTEM_PROMPT,
                messages=api_messages,
            )
            reply_text = "".join(
                block.text for block in response.content if block.type == "text"
            )
        except Exception as exc:
            reply_text = f"Something went wrong reaching the AI service: {exc}"
    # ---------------------

    conn.execute(
        "INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)",
        (session_id, "assistant", reply_text),
    )
    conn.commit()
    conn.close()

    return jsonify({"reply": reply_text})


if __name__ == "__main__":
    app.run(debug=True)