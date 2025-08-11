// Демонстрационный скрипт работы бота без Telegram API
const Database = require('./src/database/database');
const { exercises, goals } = require('./src/data/exercises');

class BotDemo {
    constructor() {
        this.db = new Database();
        this.currentUser = null;
    }

    async simulateUserJourney() {
        console.log('🎬 Демонстрация работы TraineeBot\n');

        // Симуляция регистрации пользователя
        await this.simulateRegistration();
        
        // Симуляция заполнения профиля
        await this.simulateProfileSetup();
        
        // Симуляция выбора тренировки
        await this.simulateWorkoutSelection();
        
        // Симуляция сохранения тренировки
        await this.simulateSaveWorkout();

        console.log('\n✅ Демонстрация завершена!');
        this.db.close();
    }

    async simulateRegistration() {
        console.log('👤 Регистрация пользователя...');
        
        const user = {
            telegram_id: 987654321,
            username: 'demo_user',
            first_name: 'Демо Пользователь'
        };

        await this.db.createOrUpdateUser(user);
        this.currentUser = user;
        
        console.log(`✅ Пользователь ${user.first_name} зарегистрирован`);
        console.log('🤖 Бот: Привет! Давайте настроим ваш профиль для персональных тренировок!\n');
    }

    async simulateProfileSetup() {
        console.log('⚙️ Настройка профиля...');
        
        const profile = {
            age: '26-35',
            gender: 'male',
            fitness_level: 'intermediate',
            goals: 'mass_gain'
        };

        await this.db.updateUserProfile(this.currentUser.telegram_id, profile);
        
        console.log('👤 Пользователь выбрал:');
        console.log(`   Возраст: ${profile.age}`);
        console.log(`   Пол: Мужской`);
        console.log(`   Уровень: Средний`);
        console.log(`   Цель: ${goals[profile.goals]}`);
        console.log('🤖 Бот: Отлично! Профиль настроен. Теперь выберите группу мышц!\n');
    }

    async simulateWorkoutSelection() {
        console.log('🏋️ Выбор тренировки...');
        
        const selectedMuscle = 'chest';
        const muscleData = exercises[selectedMuscle];
        const user = await this.db.getUser(this.currentUser.telegram_id);
        
        console.log(`👤 Пользователь выбрал: ${muscleData.name}`);
        console.log('🤖 Бот генерирует тренировку...\n');
        
        console.log('📋 ПЕРСОНАЛЬНАЯ ТРЕНИРОВКА');
        console.log('=' .repeat(40));
        console.log(`🏋️ Группа мышц: ${muscleData.name}`);
        console.log(`🎯 Цель: ${goals[user.goals]}`);
        console.log('=' .repeat(40));
        
        muscleData.exercises.forEach((exercise, index) => {
            const sets = exercise[user.goals];
            console.log(`${index + 1}. ${exercise.name}`);
            console.log(`   📝 ${exercise.description}`);
            console.log(`   📊 ${sets.sets} подходов × ${sets.reps} повторений`);
            console.log('');
        });

        this.currentWorkout = {
            muscle: selectedMuscle,
            exercises: muscleData.exercises,
            goal: user.goals
        };
    }

    async simulateSaveWorkout() {
        console.log('💾 Сохранение тренировки...');
        
        const workoutName = `${exercises[this.currentWorkout.muscle].name} - ${goals[this.currentWorkout.goal]}`;
        
        await this.db.saveWorkout(
            this.currentUser.telegram_id,
            this.currentWorkout,
            workoutName
        );
        
        console.log(`✅ Тренировка "${workoutName}" сохранена!`);
        console.log('🤖 Бот: Тренировка сохранена в избранное! Удачных тренировок! 💪\n');
        
        // Показать сохраненные тренировки
        const savedWorkouts = await this.db.getSavedWorkouts(this.currentUser.telegram_id);
        console.log('📚 Сохраненные тренировки:');
        savedWorkouts.forEach((workout, index) => {
            const date = new Date(workout.created_at).toLocaleDateString('ru-RU');
            console.log(`   ${index + 1}. ${workout.workout_name} (${date})`);
        });
    }

    static showFeatures() {
        console.log('\n🚀 ВОЗМОЖНОСТИ TRAINEEBOT');
        console.log('=' .repeat(50));
        console.log('✅ Персонализированные тренировки');
        console.log('✅ 6 групп мышц: грудь, спина, ноги, плечи, руки, пресс');
        console.log('✅ 3 цели: набор массы, сжигание жира, поддержка формы');
        console.log('✅ Сохранение любимых тренировок');
        console.log('✅ Учет уровня подготовки');
        console.log('✅ Интуитивный интерфейс с кнопками');
        console.log('=' .repeat(50));
    }
}

// Запуск демонстрации
async function runDemo() {
    BotDemo.showFeatures();
    
    const demo = new BotDemo();
    await demo.simulateUserJourney();
}

if (require.main === module) {
    runDemo().catch(console.error);
}

module.exports = BotDemo;
