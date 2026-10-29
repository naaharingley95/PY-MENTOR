"""Google Gemini AI service for PyMentor AI assistant."""

from google import genai
from google.genai import types

from app.config import get_settings

settings = get_settings()

client = genai.Client(api_key=settings.gemini_api_key)

SYSTEM_PROMPT = """You are PyMentor AI, an expert Python programming assistant. You are helpful, precise, and developer-friendly.

Rules:
- Always provide clear, well-formatted responses using Markdown.
- Use fenced code blocks with `python` language tag for ALL code snippets.
- Include helpful comments in code.
- Be concise but thorough.
- If a question is ambiguous, ask for clarification.
- For errors, explain the root cause before the fix.
- Use best practices and PEP 8 conventions.
"""

MODE_PROMPTS = {
    "ask": "Answer this Python programming question clearly and concisely. Provide code examples where helpful.",
    "generate": "Generate clean, well-documented Python code for the following request. Include docstrings, type hints, and example usage.",
    "debug": "Debug the following Python code. Identify the bug, explain the root cause, provide the corrected code, and explain the fix.",
    "explain": "Explain the following Python code line by line. Cover what each part does, any design patterns used, and potential improvements.",
    "complexity": "Analyze the time and space complexity of the following Python code. Provide Big-O notation for both, explain your reasoning step by step, and suggest optimizations if possible.",
    "tests": "Generate comprehensive unit tests for the following Python code using pytest. Include edge cases, boundary conditions, and descriptive test names.",
    "hint": "Provide helpful hints and guidance for solving this Python programming problem. Don't give the full solution — give progressive hints that guide the learner toward the answer.",
}

# Ordered list of fallback models to try if the primary model is unavailable/deprecated
FALLBACK_MODELS = [
    "gemini-3.8-flash",        # Current recommended model (as of 2026)
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
]


async def get_ai_response(content: str, mode: str = "ask") -> str:
    """Send a prompt to Gemini or use a simulated mock response if key is missing/placeholder."""
    key = settings.gemini_api_key
    is_placeholder = (
        not key
        or key == "your-gemini-api-key-here"
        or "change-me" in key
        or key.strip() == ""
    )

    if is_placeholder:
        # Simulated responses for different modes to allow testing without an active API key
        mock_templates = {
            "ask": (
                "ℹ️ **Demo Mode (No Gemini API Key Configured)**\n\n"
                "To ask Python questions to real AI, get a free key from [Google AI Studio](https://aistudio.google.com/apikey) "
                "and set `GEMINI_API_KEY` in `backend/.env`.\n\n"
                "Here is a sample Python explanation for your question:\n"
                "```python\n"
                "# Example demonstrating basic lists and list comprehensions\n"
                "numbers = [1, 2, 3, 4, 5]\n"
                "squares = [x**2 for x in numbers if x % 2 == 0]\n"
                "print(squares)  # Output: [4, 16]\n"
                "```\n"
                "- List comprehensions are highly efficient and readable in Python.\n"
                "- The syntax is `[expression for item in iterable if condition]`."
            ),
            "generate": (
                "ℹ️ **Demo Mode (No Gemini API Key Configured)**\n\n"
                "Please configure a valid `GEMINI_API_KEY` in `backend/.env` to generate code.\n\n"
                "Here is a generated example of a safe file reader:\n"
                "```python\n"
                "def read_file_safely(file_path: str) -> str:\n"
                "    \"\"\"Reads file contents safely and handles FileNotFoundError.\"\"\"\n"
                "    try:\n"
                "        with open(file_path, 'r', encoding='utf-8') as f:\n"
                "            return f.read()\n"
                "    except FileNotFoundError:\n"
                "        return f'Error: File at {file_path} not found.'\n"
                "```"
            ),
            "debug": (
                "ℹ️ **Demo Mode (No Gemini API Key Configured)**\n\n"
                "Please configure a valid `GEMINI_API_KEY` in `backend/.env` to debug code.\n\n"
                "Here is a sample debugging response:\n"
                "### Bug analysis\n"
                "- **Issue**: Modifying a list while iterating over it causes indexing bugs.\n"
                "- **Solution**: Iterate over a copy or use a list comprehension instead.\n"
                "```python\n"
                "# Bad code\n"
                "# for item in my_list:\n"
                "#     if condition(item): my_list.remove(item)\n"
                "\n"
                "# Fixed code\n"
                "my_list = [item for item in my_list if not condition(item)]\n"
                "```"
            ),
            "explain": (
                "ℹ️ **Demo Mode (No Gemini API Key Configured)**\n\n"
                "Please configure a valid `GEMINI_API_KEY` in `backend/.env` to explain code.\n\n"
                "Here is a sample explanation of decorated functions:\n"
                "```python\n"
                "def my_decorator(func):\n"
                "    def wrapper(*args, **kwargs):\n"
                "        print(\"Before call\")\n"
                "        result = func(*args, **kwargs)\n"
                "        print(\"After call\")\n"
                "        return result\n"
                "    return wrapper\n"
                "```\n"
                "- `@my_decorator` wraps the target function inside `wrapper`.\n"
                "- It runs additional behavior before and after execution."
            ),
            "complexity": (
                "ℹ️ **Demo Mode (No Gemini API Key Configured)**\n\n"
                "Please configure a valid `GEMINI_API_KEY` in `backend/.env` to analyze complexity.\n\n"
                "Here is a sample complexity analysis:\n"
                "- **Time Complexity**: $O(N)$ because the code iterates through the list of size $N$ once.\n"
                "- **Space Complexity**: $O(1)$ auxiliary space as only basic pointer variables are used."
            ),
            "tests": (
                "ℹ️ **Demo Mode (No Gemini API Key Configured)**\n\n"
                "Please configure a valid `GEMINI_API_KEY` in `backend/.env` to generate tests.\n\n"
                "Here are typical tests using `pytest`:\n"
                "```python\n"
                "import pytest\n"
                "\n"
                "def test_addition():\n"
                "    assert add(2, 3) == 5\n"
                "    assert add(-1, 1) == 0\n"
                "```"
            ),
            "hint": (
                "ℹ️ **Demo Mode (No Gemini API Key Configured)**\n\n"
                "Please configure a valid `GEMINI_API_KEY` in `backend/.env` to get hints.\n\n"
                "### Hints:\n"
                "1. Think about using a hash map (dict) to store indices of visited numbers.\n"
                "2. The difference `target - num` is what you should check for."
            ),
        }
        return mock_templates.get(mode, mock_templates["ask"])

    mode_instruction = MODE_PROMPTS.get(mode, MODE_PROMPTS["ask"])
    full_prompt = f"{mode_instruction}\n\n{content}"

    # Build list of models to try: configured model first, then fallbacks (deduped)
    primary_model = settings.gemini_model
    models_to_try = [primary_model] + [m for m in FALLBACK_MODELS if m != primary_model]

    last_error: str = ""
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.7,
                    max_output_tokens=4096,
                ),
            )
            return response.text or "I couldn't generate a response. Please try again."
        except Exception as e:
            error_msg = str(e)
            # If the model is deprecated / not found, try the next fallback
            if "404" in error_msg or "NOT_FOUND" in error_msg or "no longer available" in error_msg.lower():
                last_error = error_msg
                continue
            # Auth errors — return immediately, retrying won't help
            if "API_KEY" in error_msg.upper() or "401" in error_msg or "403" in error_msg:
                return (
                    "⚠️ **API Key Error**: The Gemini API key is invalid or not configured.\n\n"
                    "Please set a valid `GEMINI_API_KEY` in your `.env` file.\n"
                    "Get a free key at [Google AI Studio](https://aistudio.google.com/apikey)."
                )
            # Any other unexpected error — surface it immediately
            return f"⚠️ **AI Service Error**: {error_msg}\n\nPlease try again in a moment."

    # All models in the fallback chain are exhausted
    return (
        "⚠️ **AI Service Error**: All available Gemini models are currently unavailable.\n\n"
        f"Last error: {last_error}\n\n"
        "Please try again later or check your API key at "
        "[Google AI Studio](https://aistudio.google.com/apikey)."
    )

