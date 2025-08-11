const exercises = {
    chest: {
        name: "Грудь",
        exercises: [
            {
                name: "Отжимания",
                description: "Классические отжимания от пола",
                mass_gain: { sets: 4, reps: "8-12" },
                fat_burn: { sets: 3, reps: "15-20" },
                maintenance: { sets: 3, reps: "10-15" }
            },
            {
                name: "Отжимания на брусьях",
                description: "Отжимания на параллельных брусьях",
                mass_gain: { sets: 4, reps: "6-10" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "8-12" }
            },
            {
                name: "Жим лежа",
                description: "Жим штанги лежа на горизонтальной скамье",
                mass_gain: { sets: 4, reps: "6-8" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "8-10" }
            },
            {
                name: "Разведение гантелей",
                description: "Разведение гантелей лежа на скамье",
                mass_gain: { sets: 3, reps: "10-12" },
                fat_burn: { sets: 3, reps: "15-18" },
                maintenance: { sets: 3, reps: "12-15" }
            }
        ]
    },
    back: {
        name: "Спина",
        exercises: [
            {
                name: "Подтягивания",
                description: "Подтягивания на турнике",
                mass_gain: { sets: 4, reps: "6-10" },
                fat_burn: { sets: 3, reps: "10-15" },
                maintenance: { sets: 3, reps: "8-12" }
            },
            {
                name: "Тяга в наклоне",
                description: "Тяга штанги в наклоне",
                mass_gain: { sets: 4, reps: "8-10" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "10-12" }
            },
            {
                name: "Гиперэкстензия",
                description: "Разгибания спины на тренажере",
                mass_gain: { sets: 3, reps: "12-15" },
                fat_burn: { sets: 3, reps: "15-20" },
                maintenance: { sets: 3, reps: "12-18" }
            },
            {
                name: "Тяга вертикального блока",
                description: "Тяга верхнего блока к груди",
                mass_gain: { sets: 4, reps: "8-12" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "10-14" }
            }
        ]
    },
    legs: {
        name: "Ноги",
        exercises: [
            {
                name: "Приседания",
                description: "Классические приседания",
                mass_gain: { sets: 4, reps: "8-12" },
                fat_burn: { sets: 3, reps: "15-20" },
                maintenance: { sets: 3, reps: "12-15" }
            },
            {
                name: "Выпады",
                description: "Выпады вперед с собственным весом",
                mass_gain: { sets: 3, reps: "10-12 на каждую ногу" },
                fat_burn: { sets: 3, reps: "15-18 на каждую ногу" },
                maintenance: { sets: 3, reps: "12-15 на каждую ногу" }
            },
            {
                name: "Подъемы на носки",
                description: "Подъемы на носки стоя",
                mass_gain: { sets: 4, reps: "15-20" },
                fat_burn: { sets: 3, reps: "20-25" },
                maintenance: { sets: 3, reps: "18-22" }
            },
            {
                name: "Румынская тяга",
                description: "Тяга штанги на прямых ногах",
                mass_gain: { sets: 4, reps: "8-10" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "10-12" }
            }
        ]
    },
    shoulders: {
        name: "Плечи",
        exercises: [
            {
                name: "Жим стоя",
                description: "Армейский жим штанги стоя",
                mass_gain: { sets: 4, reps: "6-8" },
                fat_burn: { sets: 3, reps: "10-12" },
                maintenance: { sets: 3, reps: "8-10" }
            },
            {
                name: "Разведение гантелей в стороны",
                description: "Махи гантелями в стороны",
                mass_gain: { sets: 3, reps: "12-15" },
                fat_burn: { sets: 3, reps: "15-18" },
                maintenance: { sets: 3, reps: "12-16" }
            },
            {
                name: "Обратные разведения",
                description: "Разведения в наклоне на заднюю дельту",
                mass_gain: { sets: 3, reps: "12-15" },
                fat_burn: { sets: 3, reps: "15-18" },
                maintenance: { sets: 3, reps: "12-16" }
            },
            {
                name: "Жим гантелей сидя",
                description: "Жим гантелей сидя на скамье",
                mass_gain: { sets: 4, reps: "8-10" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "10-12" }
            }
        ]
    },
    arms: {
        name: "Руки",
        exercises: [
            {
                name: "Сгибания на бицепс",
                description: "Подъем штанги на бицепс стоя",
                mass_gain: { sets: 4, reps: "8-10" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "10-12" }
            },
            {
                name: "Французский жим",
                description: "Разгибания рук со штангой лежа",
                mass_gain: { sets: 4, reps: "8-10" },
                fat_burn: { sets: 3, reps: "12-15" },
                maintenance: { sets: 3, reps: "10-12" }
            },
            {
                name: "Молотки",
                description: "Подъемы гантелей хватом молоток",
                mass_gain: { sets: 3, reps: "10-12" },
                fat_burn: { sets: 3, reps: "15-18" },
                maintenance: { sets: 3, reps: "12-15" }
            },
            {
                name: "Обратные отжимания",
                description: "Отжимания от скамьи сзади",
                mass_gain: { sets: 3, reps: "8-12" },
                fat_burn: { sets: 3, reps: "15-20" },
                maintenance: { sets: 3, reps: "12-15" }
            }
        ]
    },
    abs: {
        name: "Пресс",
        exercises: [
            {
                name: "Скручивания",
                description: "Классические скручивания лежа",
                mass_gain: { sets: 3, reps: "15-20" },
                fat_burn: { sets: 4, reps: "20-25" },
                maintenance: { sets: 3, reps: "18-22" }
            },
            {
                name: "Планка",
                description: "Статическое упражнение планка",
                mass_gain: { sets: 3, reps: "30-45 сек" },
                fat_burn: { sets: 4, reps: "45-60 сек" },
                maintenance: { sets: 3, reps: "40-50 сек" }
            },
            {
                name: "Велосипед",
                description: "Скручивания с имитацией велосипеда",
                mass_gain: { sets: 3, reps: "20-25" },
                fat_burn: { sets: 4, reps: "25-30" },
                maintenance: { sets: 3, reps: "22-28" }
            },
            {
                name: "Подъемы ног",
                description: "Подъемы ног лежа на спине",
                mass_gain: { sets: 3, reps: "12-15" },
                fat_burn: { sets: 4, reps: "15-20" },
                maintenance: { sets: 3, reps: "15-18" }
            }
        ]
    }
};

const goals = {
    mass_gain: "Набор массы",
    fat_burn: "Сжигание жира", 
    maintenance: "Поддержка формы"
};

const fitnessLevels = {
    beginner: "Новичок",
    intermediate: "Средний",
    advanced: "Продвинутый"
};

module.exports = {
    exercises,
    goals,
    fitnessLevels
};
