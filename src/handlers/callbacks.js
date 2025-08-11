const { exercises, goals, fitnessLevels } = require('../data/exercises');
const { showMainMenu } = require('./commands');

async function handleCallbackQuery(bot, callbackQuery, db) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const user = callbackQuery.from;

    try {
        // Подтверждаем получение callback
        await bot.answerCallbackQuery(callbackQuery.id);

        if (data === 'setup_profile') {
            await startProfileSetup(bot, chatId, user.id, db);
        } else if (data.startsWith('age_')) {
            await handleAgeSelection(bot, chatId, user.id, data, db);
        } else if (data.startsWith('gender_')) {
            await handleGenderSelection(bot, chatId, user.id, data, db);
        } else if (data.startsWith('level_')) {
            await handleLevelSelection(bot, chatId, user.id, data, db);
        } else if (data.startsWith('goal_')) {
            await handleGoalSelection(bot, chatId, user.id, data, db);
        } else if (data.startsWith('muscle_')) {
            await handleMuscleSelection(bot, chatId, user.id, data, db);
        } else if (data.startsWith('workout_')) {
            await handleWorkoutGeneration(bot, chatId, user.id, data, db);
        } else if (data.startsWith('save_workout_')) {
            await handleSaveWorkout(bot, chatId, user.id, data, db);
        } else if (data === 'my_workouts') {
            await showSavedWorkouts(bot, chatId, user.id, db);
        } else if (data === 'profile') {
            await showProfile(bot, chatId, user.id, db);
        } else if (data === 'main_menu') {
            await showMainMenu(bot, chatId, user.first_name);
        }
    } catch (error) {
        console.error('Ошибка в handleCallbackQuery:', error);
        await bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте позже.');
    }
}

async function startProfileSetup(bot, chatId, userId, db) {
    const keyboard = {
        inline_keyboard: [
            [
                { text: "16-25", callback_data: "age_16-25" },
                { text: "26-35", callback_data: "age_26-35" }
            ],
            [
                { text: "36-45", callback_data: "age_36-45" },
                { text: "46+", callback_data: "age_46+" }
            ]
        ]
    };

    await bot.sendMessage(chatId, 
        "Начнем с возраста. Выберите вашу возрастную группу:",
        { reply_markup: keyboard }
    );
}

async function handleAgeSelection(bot, chatId, userId, data, db) {
    const age = data.replace('age_', '');
    
    // Сохраняем временно в памяти (можно улучшить через Redis или сессии)
    if (!global.userProfiles) global.userProfiles = {};
    if (!global.userProfiles[userId]) global.userProfiles[userId] = {};
    global.userProfiles[userId].age = age;

    const keyboard = {
        inline_keyboard: [
            [
                { text: "👨 Мужской", callback_data: "gender_male" },
                { text: "👩 Женский", callback_data: "gender_female" }
            ]
        ]
    };

    await bot.sendMessage(chatId, 
        "Отлично! Теперь укажите ваш пол:",
        { reply_markup: keyboard }
    );
}

async function handleGenderSelection(bot, chatId, userId, data, db) {
    const gender = data.replace('gender_', '');
    
    if (!global.userProfiles[userId]) global.userProfiles[userId] = {};
    global.userProfiles[userId].gender = gender;

    const keyboard = {
        inline_keyboard: [
            [
                { text: "🆕 Новичок", callback_data: "level_beginner" }
            ],
            [
                { text: "📈 Средний уровень", callback_data: "level_intermediate" }
            ],
            [
                { text: "🔥 Продвинутый", callback_data: "level_advanced" }
            ]
        ]
    };

    await bot.sendMessage(chatId, 
        "Каков ваш уровень физической подготовки?",
        { reply_markup: keyboard }
    );
}

async function handleLevelSelection(bot, chatId, userId, data, db) {
    const level = data.replace('level_', '');
    
    if (!global.userProfiles[userId]) global.userProfiles[userId] = {};
    global.userProfiles[userId].fitness_level = level;

    const keyboard = {
        inline_keyboard: [
            [
                { text: "💪 Набор массы", callback_data: "goal_mass_gain" }
            ],
            [
                { text: "🔥 Сжигание жира", callback_data: "goal_fat_burn" }
            ],
            [
                { text: "⚖️ Поддержка формы", callback_data: "goal_maintenance" }
            ]
        ]
    };

    await bot.sendMessage(chatId, 
        "Какая у вас основная цель тренировок?",
        { reply_markup: keyboard }
    );
}

async function handleGoalSelection(bot, chatId, userId, data, db) {
    const goal = data.replace('goal_', '');
    
    if (!global.userProfiles[userId]) global.userProfiles[userId] = {};
    global.userProfiles[userId].goals = goal;

    // Сохраняем профиль в базу данных
    const profile = global.userProfiles[userId];
    await db.updateUserProfile(userId, profile);

    // Очищаем временные данные
    delete global.userProfiles[userId];

    await bot.sendMessage(chatId, 
        "Отлично! Ваш профиль настроен! 🎉\n\n" +
        "Теперь я могу подбирать для вас персональные тренировки."
    );

    // Показываем главное меню
    const user = await db.getUser(userId);
    await showMainMenu(bot, chatId, user.first_name);
}

async function handleMuscleSelection(bot, chatId, userId, data, db) {
    const muscle = data.replace('muscle_', '');
    const muscleData = exercises[muscle];
    
    if (!muscleData) {
        await bot.sendMessage(chatId, "Группа мышц не найдена.");
        return;
    }

    // Получаем цель пользователя
    const user = await db.getUser(userId);
    if (!user || !user.goals) {
        await bot.sendMessage(chatId, "Пожалуйста, сначала настройте профиль.");
        return;
    }

    const keyboard = {
        inline_keyboard: [
            [
                { text: "🏋️ Создать тренировку", callback_data: `workout_${muscle}` }
            ],
            [
                { text: "◀️ Назад", callback_data: "main_menu" }
            ]
        ]
    };

    await bot.sendMessage(chatId, 
        `Выбрана группа: *${muscleData.name}* 💪\n\n` +
        `Доступно ${muscleData.exercises.length} упражнений\n` +
        `Цель: ${goals[user.goals]}`,
        { 
            parse_mode: 'Markdown',
            reply_markup: keyboard 
        }
    );
}

async function handleWorkoutGeneration(bot, chatId, userId, data, db) {
    const muscle = data.replace('workout_', '');
    const muscleData = exercises[muscle];
    
    const user = await db.getUser(userId);
    const userGoal = user.goals;
    
    let workoutText = `🏋️ *Тренировка: ${muscleData.name}*\n`;
    workoutText += `🎯 Цель: ${goals[userGoal]}\n\n`;
    
    const workoutExercises = [];
    
    muscleData.exercises.forEach((exercise, index) => {
        const sets = exercise[userGoal];
        workoutText += `${index + 1}. *${exercise.name}*\n`;
        workoutText += `   📝 ${exercise.description}\n`;
        workoutText += `   📊 ${sets.sets} подходов × ${sets.reps} повторений\n\n`;
        
        workoutExercises.push({
            name: exercise.name,
            description: exercise.description,
            sets: sets.sets,
            reps: sets.reps
        });
    });

    const keyboard = {
        inline_keyboard: [
            [
                { text: "💾 Сохранить тренировку", callback_data: `save_workout_${muscle}` }
            ],
            [
                { text: "🔄 Новая тренировка", callback_data: `workout_${muscle}` },
                { text: "◀️ Назад", callback_data: `muscle_${muscle}` }
            ],
            [
                { text: "🏠 Главное меню", callback_data: "main_menu" }
            ]
        ]
    };

    await bot.sendMessage(chatId, workoutText, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });

    // Сохраняем данные тренировки для возможного сохранения
    if (!global.currentWorkouts) global.currentWorkouts = {};
    global.currentWorkouts[userId] = {
        muscle: muscle,
        exercises: workoutExercises,
        goal: userGoal
    };
}

async function handleSaveWorkout(bot, chatId, userId, data, db) {
    const muscle = data.replace('save_workout_', '');
    
    if (!global.currentWorkouts || !global.currentWorkouts[userId]) {
        await bot.sendMessage(chatId, "Нет активной тренировки для сохранения.");
        return;
    }

    const workout = global.currentWorkouts[userId];
    const workoutName = `${exercises[muscle].name} - ${goals[workout.goal]}`;
    
    try {
        await db.saveWorkout(userId, workout, workoutName);
        await bot.sendMessage(chatId, 
            `✅ Тренировка "${workoutName}" сохранена!`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🏠 Главное меню", callback_data: "main_menu" }]
                    ]
                }
            }
        );
        
        // Очищаем текущую тренировку
        delete global.currentWorkouts[userId];
    } catch (error) {
        console.error('Ошибка сохранения тренировки:', error);
        await bot.sendMessage(chatId, "Ошибка при сохранении тренировки.");
    }
}

async function showSavedWorkouts(bot, chatId, userId, db) {
    try {
        const savedWorkouts = await db.getSavedWorkouts(userId);
        
        if (savedWorkouts.length === 0) {
            await bot.sendMessage(chatId, 
                "У вас пока нет сохраненных тренировок. 📝",
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "◀️ Назад", callback_data: "main_menu" }]
                        ]
                    }
                }
            );
            return;
        }

        let text = "💾 *Ваши сохраненные тренировки:*\n\n";
        
        savedWorkouts.forEach((workout, index) => {
            const date = new Date(workout.created_at).toLocaleDateString('ru-RU');
            text += `${index + 1}. ${workout.workout_name}\n`;
            text += `   📅 Создано: ${date}\n\n`;
        });

        await bot.sendMessage(chatId, text, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "◀️ Назад", callback_data: "main_menu" }]
                ]
            }
        });
    } catch (error) {
        console.error('Ошибка получения сохраненных тренировок:', error);
        await bot.sendMessage(chatId, "Ошибка при загрузке тренировок.");
    }
}

async function showProfile(bot, chatId, userId, db) {
    try {
        const user = await db.getUser(userId);
        
        if (!user) {
            await bot.sendMessage(chatId, "Профиль не найден.");
            return;
        }

        let profileText = "👤 *Ваш профиль:*\n\n";
        profileText += `👤 Имя: ${user.first_name}\n`;
        profileText += `📅 Возраст: ${user.age || 'Не указан'}\n`;
        profileText += `👫 Пол: ${user.gender === 'male' ? 'Мужской' : user.gender === 'female' ? 'Женский' : 'Не указан'}\n`;
        profileText += `💪 Уровень: ${fitnessLevels[user.fitness_level] || 'Не указан'}\n`;
        profileText += `🎯 Цель: ${goals[user.goals] || 'Не указана'}\n`;

        await bot.sendMessage(chatId, profileText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "📝 Изменить профиль", callback_data: "setup_profile" }
                    ],
                    [
                        { text: "◀️ Назад", callback_data: "main_menu" }
                    ]
                ]
            }
        });
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        await bot.sendMessage(chatId, "Ошибка при загрузке профиля.");
    }
}

module.exports = {
    handleCallbackQuery
};
