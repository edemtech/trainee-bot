// Сервис тренировок
const exercises = {
    chest: { name: "Грудь", exercises: [
        { name: "Отжимания", description: "Классические отжимания", mass_gain: {sets: 4, reps: "8-12"}, fat_burn: {sets: 3, reps: "15-20"}, maintenance: {sets: 3, reps: "10-15"} },
        { name: "Жим лежа", description: "Жим штанги лежа", mass_gain: {sets: 4, reps: "6-8"}, fat_burn: {sets: 3, reps: "12-15"}, maintenance: {sets: 3, reps: "8-10"} }
    ]},
    back: { name: "Спина", exercises: [
        { name: "Подтягивания", description: "Подтягивания на турнике", mass_gain: {sets: 4, reps: "6-10"}, fat_burn: {sets: 3, reps: "10-15"}, maintenance: {sets: 3, reps: "8-12"} },
        { name: "Тяга в наклоне", description: "Тяга штанги", mass_gain: {sets: 4, reps: "8-10"}, fat_burn: {sets: 3, reps: "12-15"}, maintenance: {sets: 3, reps: "10-12"} }
    ]},
    legs: { name: "Ноги", exercises: [
        { name: "Приседания", description: "Классические приседания", mass_gain: {sets: 4, reps: "8-12"}, fat_burn: {sets: 3, reps: "15-20"}, maintenance: {sets: 3, reps: "12-15"} },
        { name: "Выпады", description: "Выпады вперед", mass_gain: {sets: 3, reps: "10-12"}, fat_burn: {sets: 3, reps: "15-18"}, maintenance: {sets: 3, reps: "12-15"} }
    ]},
    shoulders: { name: "Плечи", exercises: [
        { name: "Жим стоя", description: "Армейский жим", mass_gain: {sets: 4, reps: "6-8"}, fat_burn: {sets: 3, reps: "10-12"}, maintenance: {sets: 3, reps: "8-10"} },
        { name: "Махи в стороны", description: "Махи гантелями", mass_gain: {sets: 3, reps: "12-15"}, fat_burn: {sets: 3, reps: "15-18"}, maintenance: {sets: 3, reps: "12-16"} }
    ]},
    arms: { name: "Руки", exercises: [
        { name: "Подъем на бицепс", description: "Подъем штанги", mass_gain: {sets: 4, reps: "8-10"}, fat_burn: {sets: 3, reps: "12-15"}, maintenance: {sets: 3, reps: "10-12"} },
        { name: "Французский жим", description: "Разгибания рук", mass_gain: {sets: 4, reps: "8-10"}, fat_burn: {sets: 3, reps: "12-15"}, maintenance: {sets: 3, reps: "10-12"} }
    ]},
    abs: { name: "Пресс", exercises: [
        { name: "Скручивания", description: "Классические скручивания", mass_gain: {sets: 3, reps: "15-20"}, fat_burn: {sets: 4, reps: "20-25"}, maintenance: {sets: 3, reps: "18-22"} },
        { name: "Планка", description: "Статическая планка", mass_gain: {sets: 3, reps: "30-45с"}, fat_burn: {sets: 4, reps: "45-60с"}, maintenance: {sets: 3, reps: "40-50с"} }
    ]}
};

class WorkoutService {
    constructor() {
        this.exercises = exercises;
        this.goals = { mass_gain: "Набор массы", fat_burn: "Сжигание жира", maintenance: "Поддержка формы" };
    }

    generate(muscle, goal) {
        const muscleData = this.exercises[muscle];
        if (!muscleData) return null;

        return {
            name: muscleData.name,
            goal: this.goals[goal],
            exercises: muscleData.exercises.map(ex => ({
                name: ex.name,
                description: ex.description,
                sets: ex[goal].sets,
                reps: ex[goal].reps
            }))
        };
    }

    formatWorkout(workout) {
        let text = `🏋️ *${workout.name}*\n🎯 ${workout.goal}\n\n`;
        workout.exercises.forEach((ex, i) => {
            text += `${i+1}. *${ex.name}*\n   ${ex.description}\n   ${ex.sets} × ${ex.reps}\n\n`;
        });
        return text;
    }

    getMuscles() {
        return Object.keys(this.exercises);
    }
}

module.exports = WorkoutService;
