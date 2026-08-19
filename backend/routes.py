from flask import Blueprint, request, jsonify

from chain import get_chain
from firebase_service import save_chat, get_chat_history, create_user

chat_bp = Blueprint("chat", __name__)
auth_bp = Blueprint("auth", __name__)


def extract_text(content):
    """Normalize LangChain message content into a plain string.

    Depending on the model/provider, `.content` can be a plain string,
    or a list of content blocks like [{"type": "text", "text": "...", ...}]
    (used for things like thinking traces, tool calls, etc). We only want
    the human-readable text out of it.
    """
    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict):
                if block.get("type") == "text" and "text" in block:
                    parts.append(block["text"])
                elif "text" in block:
                    parts.append(block["text"])
        return "".join(parts) if parts else str(content)

    return str(content)


@chat_bp.route("", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")
    message = data.get("message")

    if not user_id or not message:
        return jsonify({"error": "Missing user_id or message"}), 400

    try:
        chain = get_chain()
        response = chain.invoke({"input": message})
    except Exception as exc:
        return jsonify({"error": f"Chat failed: {exc}"}), 502

    reply_text = extract_text(response.content)

    save_chat(user_id, message, reply_text)

    return jsonify({"response": reply_text})


@chat_bp.route("/history/<user_id>", methods=["GET"])
def history(user_id):
    return jsonify(get_chat_history(user_id))


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    result = create_user(email, password)
    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 201