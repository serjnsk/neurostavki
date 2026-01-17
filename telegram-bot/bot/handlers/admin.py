from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command
from sqlalchemy import select, func
from bot.database import async_session
from bot.database.models import TelegramSubscriber
from bot.config import get_settings

router = Router()


def is_admin(user_id: int) -> bool:
    """Check if user is admin."""
    settings = get_settings()
    return user_id in settings.admin_id_list


@router.message(Command("stats"))
async def cmd_stats(message: Message):
    """Show subscriber statistics. Admin only."""
    if not is_admin(message.from_user.id):
        await message.answer("⛔ Эта команда доступна только администраторам.")
        return
    
    async with async_session() as session:
        # Total subscribers
        total = await session.scalar(
            select(func.count()).select_from(TelegramSubscriber)
        )
        
        # Active subscribers
        active = await session.scalar(
            select(func.count()).select_from(TelegramSubscriber).where(
                TelegramSubscriber.is_active == True
            )
        )
        
        # Completed onboarding
        completed = await session.scalar(
            select(func.count()).select_from(TelegramSubscriber).where(
                TelegramSubscriber.onboarding_complete == True
            )
        )
        
        # By geo
        russia = await session.scalar(
            select(func.count()).select_from(TelegramSubscriber).where(
                TelegramSubscriber.geo == "russia"
            )
        )
        all_world = await session.scalar(
            select(func.count()).select_from(TelegramSubscriber).where(
                TelegramSubscriber.geo == "all"
            )
        )
        
        # Get all sports preferences
        result = await session.execute(
            select(TelegramSubscriber.sports)
        )
        all_sports = result.scalars().all()
        
        sport_counts = {
            "football": 0, "hockey": 0, "basketball": 0,
            "tennis": 0, "esports": 0, "mma": 0
        }
        
        for sports_list in all_sports:
            if isinstance(sports_list, list):
                for sport in sports_list:
                    if sport in sport_counts:
                        sport_counts[sport] += 1
    
    # Format message
    sport_labels = {
        "football": "⚽ Футбол",
        "hockey": "🏒 Хоккей", 
        "basketball": "🏀 Баскетбол",
        "tennis": "🎾 Теннис",
        "esports": "🎮 Киберспорт",
        "mma": "🥊 Бокс/ММА"
    }
    
    sports_text = "\n".join([
        f"  {sport_labels[k]}: {v}" 
        for k, v in sport_counts.items()
    ])
    
    stats_text = f"""📊 <b>Статистика подписчиков</b>

👥 <b>Всего:</b> {total or 0}
✅ <b>Активных:</b> {active or 0}
📝 <b>Прошли опрос:</b> {completed or 0}

🌍 <b>По географии:</b>
  🇷🇺 Россия: {russia or 0}
  🌐 Весь мир: {all_world or 0}

🏆 <b>По видам спорта:</b>
{sports_text}
"""
    
    await message.answer(stats_text, parse_mode="HTML")


@router.message(Command("broadcast"))
async def cmd_broadcast(message: Message):
    """Start broadcast to all subscribers. Admin only."""
    if not is_admin(message.from_user.id):
        await message.answer("⛔ Эта команда доступна только администраторам.")
        return
    
    # Check if there's a message to broadcast
    if not message.reply_to_message:
        await message.answer(
            "📢 <b>Рассылка сообщений</b>\n\n"
            "Чтобы сделать рассылку:\n"
            "1. Напишите сообщение, которое хотите разослать\n"
            "2. Ответьте на него командой /broadcast\n\n"
            "Сообщение будет отправлено всем активным подписчикам.",
            parse_mode="HTML"
        )
        return
    
    broadcast_message = message.reply_to_message
    
    async with async_session() as session:
        # Get all active subscribers
        result = await session.execute(
            select(TelegramSubscriber.telegram_id).where(
                TelegramSubscriber.is_active == True
            )
        )
        subscriber_ids = result.scalars().all()
    
    if not subscriber_ids:
        await message.answer("❌ Нет активных подписчиков для рассылки.")
        return
    
    await message.answer(
        f"📤 Начинаю рассылку для {len(subscriber_ids)} подписчиков..."
    )
    
    success = 0
    failed = 0
    
    for telegram_id in subscriber_ids:
        try:
            await broadcast_message.copy_to(chat_id=telegram_id)
            success += 1
        except Exception as e:
            failed += 1
            # If user blocked the bot, mark as inactive
            if "blocked" in str(e).lower() or "deactivated" in str(e).lower():
                async with async_session() as session:
                    result = await session.execute(
                        select(TelegramSubscriber).where(
                            TelegramSubscriber.telegram_id == telegram_id
                        )
                    )
                    sub = result.scalar_one_or_none()
                    if sub:
                        sub.is_active = False
                        await session.commit()
    
    await message.answer(
        f"✅ <b>Рассылка завершена!</b>\n\n"
        f"📨 Отправлено: {success}\n"
        f"❌ Ошибок: {failed}",
        parse_mode="HTML"
    )


@router.message(Command("help"))
async def cmd_admin_help(message: Message):
    """Show admin commands help."""
    if not is_admin(message.from_user.id):
        return
    
    help_text = """🔧 <b>Админ-команды</b>

/stats — Статистика подписчиков
/broadcast — Рассылка сообщений (ответьте на сообщение)
/help — Эта справка
"""
    await message.answer(help_text, parse_mode="HTML")
