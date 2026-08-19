import os
import random

import firebase_admin
from firebase_admin import credentials, firestore, auth
from firebase_admin.exceptions import FirebaseError

CRED_PATH = os.environ.get("FIREBASE_CREDENTIALS_PATH", "firebase-admin.json")

cred = credentials.Certificate(CRED_PATH)
firebase_admin.initialize_app(cred)
db = firestore.client()


def generate_user_id():
    """Generate a random 10-digit user-facing ID (distinct from the Firebase uid)."""
    return str(random.randint(1000000000, 9999999999))


def save_chat(user_id, message, response):
    """Append a message/response pair to the user's chat history."""
    doc_ref = db.collection("chats").document(user_id)
    snapshot = doc_ref.get()
    chats = snapshot.to_dict() if snapshot.exists else {"history": []}
    chats.setdefault("history", []).append({"user": message, "bot": response})
    doc_ref.set(chats)


def get_chat_history(user_id):
    """Return the stored history list for a user, or an empty list if none exists."""
    doc_ref = db.collection("chats").document(user_id)
    snapshot = doc_ref.get()
    if not snapshot.exists:
        return []
    data = snapshot.to_dict() or {}
    return data.get("history", [])


def create_user(email, password):
    """Create a Firebase Auth user plus a matching Firestore user document.

    Returns a dict with "uid" and "custom_id" on success, or a dict with
    an "error" key (e.g. duplicate email, weak password) on failure.
    """
    try:
        user = auth.create_user(email=email, password=password)
    except FirebaseError as exc:
        return {"error": str(exc)}

    user_id = generate_user_id()
    db.collection("users").document(user.uid).set({
        "email": email,
        "custom_id": user_id,
    })
    return {"uid": user.uid, "custom_id": user_id}