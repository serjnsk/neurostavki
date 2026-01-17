import asyncio
import logging
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from bot.config import get_settings
from bot.database import init_db
from bot.handlers.start import router as start_router
from bot.handlers.admin import router as admin_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def main():
    """Main entry point for the bot."""
    settings = get_settings()
    
    # Initialize bot with default properties
    bot = Bot(
        token=settings.bot_token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    
    # Initialize dispatcher
    dp = Dispatcher()
    
    # Register routers
    dp.include_router(start_router)
    dp.include_router(admin_router)
    
    # Initialize database
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized successfully")
    
    # Start polling
    logger.info("Starting bot @neirostavki_bot...")
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
