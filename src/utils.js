// Утилиты для работы с сообщениями
const formatWorkout = (exercises, goal, muscleGroup) => {
    let text = `🏋️ *Тренировка: ${muscleGroup}*\n`;
    text += `🎯 Цель: ${goal}\n\n`;
    
    exercises.forEach((exercise, index) => {
        text += `${index + 1}. *${exercise.name}*\n`;
        text += `   📝 ${exercise.description}\n`;
        text += `   📊 ${exercise.sets} подходов × ${exercise.reps} повторений\n\n`;
    });
    
    return text;
};

// Валидация пользовательских данных
const validateUserProfile = (profile) => {
    const required = ['age', 'gender', 'fitness_level', 'goals'];
    const missing = required.filter(field => !profile[field]);
    
    return {
        isValid: missing.length === 0,
        missing: missing
    };
};

// Генерация случайных упражнений
const getRandomExercises = (exerciseList, count = 4) => {
    const shuffled = [...exerciseList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, exerciseList.length));
};

// Форматирование даты
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Создание клавиатуры с кнопками
const createInlineKeyboard = (buttons) => {
    return {
        inline_keyboard: buttons
    };
};

// Эмодзи для разных групп мышц
const muscleEmojis = {
    chest: "💪",
    back: "🦵", 
    legs: "🦵",
    shoulders: "🔺",
    arms: "💪",
    abs: "🟡"
};

// Получение эмодзи для группы мышц
const getMuscleEmoji = (muscle) => {
    return muscleEmojis[muscle] || "💪";
};

module.exports = {
    formatWorkout,
    validateUserProfile,
    getRandomExercises,
    formatDate,
    createInlineKeyboard,
    getMuscleEmoji
};
