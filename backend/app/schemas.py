"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ── Auth Schemas ──────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=128)
    
    model_config = {"extra": "allow"}


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    profile: Optional[dict] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


# ── Chat Schemas ──────────────────────────────────────────────

class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=10000)
    mode: str = Field(default="ask")  # ask, generate, debug, explain, complexity, tests, hint
    conversation_id: Optional[str] = None


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    mode: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationCreate(BaseModel):
    title: str = Field(default="New Conversation", max_length=255)


class ConversationUpdate(BaseModel):
    title: str = Field(max_length=255)


class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ConversationDetail(ConversationResponse):
    messages: list[MessageResponse] = []


# ── Code Tool Schemas ─────────────────────────────────────────

class CodeAnalyzeRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20000)


class CodeDebugRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20000)
    error: str = Field(default="", max_length=5000)


class CodeExplainRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20000)


class CodeTestRequest(BaseModel):
    code: str = Field(min_length=1, max_length=20000)


class CodeHintRequest(BaseModel):
    problem: str = Field(min_length=1, max_length=5000)


class AIResponse(BaseModel):
    content: str
    mode: str
