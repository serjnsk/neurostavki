from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import CommandStart
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, List

from bot.database import async_session
from bot.database.models import TelegramSubscriber
from bot.keyboards.preferences import (
    get_welcome_keyboard,
    get_sports_keyboard,
    get_geo_keyboard,
)

router = Router()

# In-memory storage for ongoing selections (will be replaced with FSM in production)
user_selections: Dict[int, List[str]] = {}

WELCOME_MESSAGE = """🏆 <b>Добро пожаловать в Нейроставки!</b>

Вы на пороге получения доступа к AI-сервису прогнозов на спорт:

✅ 3 прогноза ежедневно, 7 дней в неделю
✅ 87% точность прогнозов
✅ ИИ обучен на 30 088 матчей
✅ Анализ 6 видов спорта

🚀 <b>Сервис находится на финальной стадии тестирования!</b>

Как только мы откроем ранний доступ — вы узнаете первыми прямо здесь, в этом боте.

📊 Хотите помочь нам сделать сервис лучше? Расскажите о своих предпочтениях!"""

SPORTS_MESSAGE = """🎯 <b>Выберите виды спорта, которые вас интересуют:</b>

Нажимайте на кнопки для выбора. Когда закончите — нажмите «Готово»."""

GEO_MESSAGE = """🌍 <b>Какие матчи вас интересуют?</b>

Выберите регион для прогнозов:"""

FINAL_MESSAGE = """🎉 <b>Отлично! Ваши предпочтения сохранены.</b>

Мы оповестим вас первыми, когда откроем ранний доступ!

💡 <i>Не отписывайтесь от бота, чтобы не пропустить уведомление.</i>"""

SKIP_MESSAGE = """✅ <b>Вы успешно записаны на ранний доступ!</b>

Мы оповестим вас первыми, когда откроем доступ к сервису.

💡 <i>Не отписывайтесь от бота, чтобы не пропустить уведомление.</i>"""


async def get_or_create_subscriber(
    session: AsyncSession,
    telegram_id: int,
    username: str | None,
    first_name: str | None,
    last_name: str | None,
) -> TelegramSubscriber:
    """Get existing subscriber or create a new one."""
    result = await session.execute(
        select(TelegramSubscriber).where(TelegramSubscriber.telegram_id == telegram_id)
    )
    subscriber = result.scalar_one_or_none()
    
    if subscriber is None:
        subscriber = TelegramSubscriber(
            telegram_id=telegram_id,
            username=username,
            first_name=first_name,
            last_name=last_name,
        )
        session.add(subscriber)
        await session.commit()
        await session.refresh(subscriber)
    
    return subscriber


@router.message(CommandStart())
async def cmd_start(message: Message):
    """Handle /start command."""
    user = message.from_user
    
    async with async_session() as session:
        subscriber = await get_or_create_subscriber(
            session=session,
            telegram_id=user.id,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
        )
        
        # Check if user already completed onboarding
        if subscriber.onboarding_complete:
            await message.answer(
                "👋 <b>С возвращением!</b>\n\n"
                "Вы уже записаны на ранний доступ. "
                "Мы обязательно сообщим, когда сервис будет готов!",
                parse_mode="HTML"
            )
            return
    
    await message.answer(
        WELCOME_MESSAGE,
        parse_mode="HTML",
        reply_markup=get_welcome_keyboard()
    )


@router.callback_query(F.data == "start_sports")
async def start_sports_selection(callback: CallbackQuery):
    """Start sports selection process."""
    user_id = callback.from_user.id
    user_selections[user_id] = []
    
    await callback.message.edit_text(
        SPORTS_MESSAGE,
        parse_mode="HTML",
        reply_markup=get_sports_keyboard([])
    )
    await callback.answer()


@router.callback_query(F.data.startswith("sport_"))
async def toggle_sport(callback: CallbackQuery):
    """Toggle sport selection."""
    user_id = callback.from_user.id
    sport_id = callback.data.replace("sport_", "")
    
    if user_id not in user_selections:
        user_selections[user_id] = []
    
    # Toggle selection
    if sport_id in user_selections[user_id]:
        user_selections[user_id].remove(sport_id)
    else:
        user_selections[user_id].append(sport_id)
    
    await callback.message.edit_reply_markup(
        reply_markup=get_sports_keyboard(user_selections[user_id])
    )
    await callback.answer()


@router.callback_query(F.data == "sports_done")
async def sports_done(callback: CallbackQuery):
    """Complete sports selection, move to geo."""
    await callback.message.edit_text(
        GEO_MESSAGE,
        parse_mode="HTML",
        reply_markup=get_geo_keyboard()
    )
    await callback.answer()


@router.callback_query(F.data.startswith("geo_"))
async def select_geo(callback: CallbackQuery):
    """Handle geo selection and save preferences."""
    user_id = callback.from_user.id
    geo = callback.data.replace("geo_", "")
    sports = user_selections.get(user_id, [])
    
    async with async_session() as session:
        result = await session.execute(
            select(TelegramSubscriber).where(TelegramSubscriber.telegram_id == user_id)
        )
        subscriber = result.scalar_one_or_none()
        
        if subscriber:
            subscriber.sports = sports
            subscriber.geo = geo
            subscriber.onboarding_complete = True
            await session.commit()
    
    # Clean up
    user_selections.pop(user_id, None)
    
    await callback.message.edit_text(
        FINAL_MESSAGE,
        parse_mode="HTML"
    )
    await callback.answer("Сохранено! 🎉")


@router.callback_query(F.data == "skip_all")
async def skip_onboarding(callback: CallbackQuery):
    """Skip preferences and just save the subscriber."""
    user_id = callback.from_user.id
    
    async with async_session() as session:
        result = await session.execute(
            select(TelegramSubscriber).where(TelegramSubscriber.telegram_id == user_id)
        )
        subscriber = result.scalar_one_or_none()
        
        if subscriber:
            subscriber.onboarding_complete = True
            await session.commit()
    
    await callback.message.edit_text(
        SKIP_MESSAGE,
        parse_mode="HTML"
    )
    await callback.answer()
