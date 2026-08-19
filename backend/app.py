import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from routes import chat_bp, auth_bp

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(chat_bp, url_prefix="/chat")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "service": "august-backend"})

    return app


app = create_app()

if __name__ == "__main__":
    # Render sets PORT automatically
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)