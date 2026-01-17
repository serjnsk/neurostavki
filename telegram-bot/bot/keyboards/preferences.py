from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from typing import List

# Sport options with their display names and callback data
SPORTS = [
    ("⚽ Футбол", "football"),
    ("🏒 Хоккей", "hockey"),
    ("🏀 Баскетбол", "basketball"),
    ("🎾 Теннис", "tennis"),
    ("🎮 Киберспорт", "esports"),
    ("🥊 Бокс / ММА", "mma"),
]


def get_welcome_keyboard() -> InlineKeyboardMarkup:
    """Get keyboard for welcome message."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="🎯 Выбрать интересующие виды спорта",
            callback_data="start_sports"
        )],
        [InlineKeyboardButton(
            text="⏭️ Пропустить",
            callback_data="skip_all"
        )]
    ])


def get_sports_keyboard(selected: List[str]) -> InlineKeyboardMarkup:
    """Get keyboard for sports selection with checkmarks for selected items."""
    buttons = []
    
    for display_name, sport_id in SPORTS:
        # Add checkmark if selected
        prefix = "✅ " if sport_id in selected else "⬜ "
        text = prefix + display_name.split(" ", 1)[1]  # Remove emoji, add checkbox
        buttons.append([InlineKeyboardButton(
            text=text,
            callback_data=f"sport_{sport_id}"
        )])
    
    # Done button
    buttons.append([InlineKeyboardButton(
        text="✅ Готово",
        callback_data="sports_done"
    )])
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def get_geo_keyboard() -> InlineKeyboardMarkup:
    """Get keyboard for geo selection."""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="🇷🇺 Только Россия",
            callback_data="geo_russia"
        )],
        [InlineKeyboardButton(
            text="🌐 Весь мир",
            callback_data="geo_all"
        )]
    ])
