import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

_chain = None  # cached singleton

SYSTEM_PROMPT = (
    "You are a helpful chatbot named August. "
    "Keep interactions healthy and supportive. Be curious, helpful, and brief. "
    "Sometimes ask questions, but not always. "
    "If unsure, reply exactly: 'Sorry!! I am not sure about this.'"
)


def get_chain():
    """Build (once) and return the cached LangChain prompt | LLM chain."""
    global _chain
    if _chain is not None:
        return _chain

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to your .env file or environment."
        )

    llm = ChatGoogleGenerativeAI(
        model="gemini-flash-latest",
        google_api_key=api_key,
        temperature=0.3,
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{input}"),
    ])

    _chain = prompt | llm
    return _chain