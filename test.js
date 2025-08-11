// Тестовый скрипт для проверки основной логики
const Database = require('./src/database/database');
const { exercises, goals, fitnessLevels } = require('./src/data/exercises');
const { validateUserProfile, getRandomExercises } = require('./src/utils');

async function testDatabase() {
    console.log('🧪 Тестирование базы данных...');
    
    const db = new Database();
    
    // Тестовый пользователь
    const testUser = {
        telegram_id: 123456789,
        username: 'test_user',
        first_name: 'Тестовый Пользователь'
    };
    
    try {
        // Создание пользователя
        await db.createOrUpdateUser(testUser);
        console.log('✅ Пользователь создан');
        
        // Обновление профиля
        const profile = {
            age: '26-35',
            gender: 'male',
            fitness_level: 'intermediate',
            goals: 'mass_gain'
        };
        
        await db.updateUserProfile(testUser.telegram_id, profile);
        console.log('✅ Профиль обновлен');
        
        // Получение пользователя
        const user = await db.getUser(testUser.telegram_id);
        console.log('✅ Пользователь получен:', user.first_name);
        
        // Сохранение тренировки
        const testWorkout = {
            muscle: 'chest',
            exercises: exercises.chest.exercises.slice(0, 3),
            goal: 'mass_gain'
        };
        
        await db.saveWorkout(testUser.telegram_id, testWorkout, 'Тестовая тренировка груди');
        console.log('✅ Тренировка сохранена');
        
        // Получение сохраненных тренировок
        const savedWorkouts = await db.getSavedWorkouts(testUser.telegram_id);
        console.log('✅ Получено тренировок:', savedWorkouts.length);
        
    } catch (error) {
        console.error('❌ Ошибка тестирования БД:', error);
    } finally {
        db.close();
    }
}

function testExerciseData() {
    console.log('\n🧪 Тестирование данных упражнений...');
    
    // Проверка структуры данных
    Object.keys(exercises).forEach(muscle => {
        const muscleData = exercises[muscle];
        console.log(`✅ ${muscleData.name}: ${muscleData.exercises.length} упражнений`);
        
        // Проверка первого упражнения
        const firstExercise = muscleData.exercises[0];
        if (firstExercise.mass_gain && firstExercise.fat_burn && firstExercise.maintenance) {
            console.log(`   ✅ Упражнение "${firstExercise.name}" имеет все цели`);
        } else {
            console.log(`   ❌ Упражнение "${firstExercise.name}" неполное`);
        }
    });
    
    // Тестирование случайного выбора
    const randomChestExercises = getRandomExercises(exercises.chest.exercises, 3);
    console.log(`✅ Получено случайных упражнений для груди: ${randomChestExercises.length}`);
}

function testValidation() {
    console.log('\n🧪 Тестирование валидации...');
    
    const completeProfile = {
        age: '26-35',
        gender: 'male', 
        fitness_level: 'intermediate',
        goals: 'mass_gain'
    };
    
    const incompleteProfile = {
        age: '26-35',
        gender: 'male'
    };
    
    const completeValidation = validateUserProfile(completeProfile);
    const incompleteValidation = validateUserProfile(incompleteProfile);
    
    console.log('✅ Полный профиль валиден:', completeValidation.isValid);
    console.log('✅ Неполный профиль не валиден:', !incompleteValidation.isValid);
    console.log('✅ Отсутствующие поля:', incompleteValidation.missing);
}

// Запуск всех тестов
async function runTests() {
    console.log('🚀 Запуск тестов TraineeBot...\n');
    
    testExerciseData();
    testValidation();
    await testDatabase();
    
    console.log('\n✅ Все тесты завершены!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Получите токен бота у @BotFather в Telegram');
    console.log('2. Добавьте токен в файл .env');
    console.log('3. Запустите бота командой: npm start');
}

// Запуск только если файл вызван напрямую
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testDatabase, testExerciseData, testValidation };
