"""Async SQLAlchemy database engine and session management."""

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=False,
    connect_args={"check_same_thread": False},  # SQLite-specific
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def _migrate_sqlite_schema():
    """Add any missing columns to existing SQLite tables (safe ALTER TABLE migration)."""
    async with engine.begin() as conn:
        for table in Base.metadata.sorted_tables:
            # Get existing columns in the table
            result = await conn.execute(text(f"PRAGMA table_info({table.name})"))
            existing_cols = {row[1] for row in result.fetchall()}

            for col in table.columns:
                if col.name not in existing_cols:
                    # Build column definition
                    col_type = col.type.compile(dialect=engine.dialect)
                    nullable = "" if col.nullable else " NOT NULL"
                    default = ""
                    if col.default is not None and col.default.is_scalar:
                        default = f" DEFAULT '{col.default.arg}'"
                    try:
                        await conn.execute(
                            text(f"ALTER TABLE {table.name} ADD COLUMN {col.name} {col_type}{nullable}{default}")
                        )
                    except Exception:
                        pass  # Column already exists or not alterable


async def init_db():
    """Create all tables on startup, then migrate any missing columns."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await _migrate_sqlite_schema()


async def get_db():
    """FastAPI dependency — yields an async DB session."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

