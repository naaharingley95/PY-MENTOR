"""Code tool API routes: analyze, debug, explain, tests, hint."""

from fastapi import APIRouter, Depends

from app.auth import get_current_user
from app.models import User
from app.schemas import (
    AIResponse,
    CodeAnalyzeRequest,
    CodeDebugRequest,
    CodeExplainRequest,
    CodeHintRequest,
    CodeTestRequest,
)
from app.services.ai_service import get_ai_response

router = APIRouter()


@router.post("/analyze", response_model=AIResponse)
async def analyze_complexity(
    data: CodeAnalyzeRequest,
    user: User = Depends(get_current_user),
):
    """Analyze time and space complexity of Python code."""
    result = await get_ai_response(data.code, mode="complexity")
    return AIResponse(content=result, mode="complexity")


@router.post("/debug", response_model=AIResponse)
async def debug_code(
    data: CodeDebugRequest,
    user: User = Depends(get_current_user),
):
    """Debug Python code with an optional error message."""
    prompt = data.code
    if data.error:
        prompt += f"\n\nError message:\n```\n{data.error}\n```"
    result = await get_ai_response(prompt, mode="debug")
    return AIResponse(content=result, mode="debug")


@router.post("/explain", response_model=AIResponse)
async def explain_code(
    data: CodeExplainRequest,
    user: User = Depends(get_current_user),
):
    """Explain Python code line by line."""
    result = await get_ai_response(data.code, mode="explain")
    return AIResponse(content=result, mode="explain")


@router.post("/generate-tests", response_model=AIResponse)
async def generate_tests(
    data: CodeTestRequest,
    user: User = Depends(get_current_user),
):
    """Generate pytest test cases for Python code."""
    result = await get_ai_response(data.code, mode="tests")
    return AIResponse(content=result, mode="tests")


@router.post("/hint", response_model=AIResponse)
async def get_hint(
    data: CodeHintRequest,
    user: User = Depends(get_current_user),
):
    """Get progressive hints for a programming problem."""
    result = await get_ai_response(data.problem, mode="hint")
    return AIResponse(content=result, mode="hint")
