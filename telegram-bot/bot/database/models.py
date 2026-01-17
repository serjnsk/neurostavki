from datetime import datetime
from typing import Optional, List
from sqlalchemy import BigInteger, String, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from bot.database import Base


class TelegramSubscriber(Base):
    """Telegram subscriber model for early access requests."""
    
    __tablename__ = "telegram_subscribers"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False)
    username: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    last_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # User preferences
    sports: Mapped[List[str]] = mapped_column(JSON, default=list)
    geo: Mapped[str] = mapped_column(String(50), default="all")
    
    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    onboarding_complete: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        nullable=False
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        onupdate=datetime.utcnow,
        nullable=True
    )
    
    def __repr__(self) -> str:
        return f"<TelegramSubscriber(id={self.id}, telegram_id={self.telegram_id}, username={self.username})>"
