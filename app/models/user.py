"""User model with tier support."""
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class Tier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    BUSINESS = "business"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    tier = Column(SQLEnum(Tier, values_callable=lambda m: [e.value for e in m]), default="free", nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    season_usage = relationship(
        "UserSeasonUsage",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class UserSeasonUsage(Base):
    __tablename__ = "user_season_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    season = Column(Integer, nullable=False, index=True)
    uploads_count = Column(Integer, default=0, nullable=False)
    exports_count = Column(Integer, default=0, nullable=False)
    reset_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="season_usage")

    __table_args__ = (
        UniqueConstraint("user_id", "season", name="uq_user_season"),
    )
