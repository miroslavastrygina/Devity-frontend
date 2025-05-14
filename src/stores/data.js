import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
    state: () => ({
        courses: null,
        blocks: null,
        lessons: null,
        tests: null,
        isLoading: false,
        backendUrl: import.meta.env.VITE_APP_BACKEND
    }),
    actions: {
        findCourse(id) {
            return this.courses.find(course => course.id === Number(id));
        },
        findBlock(id) {
            return this.blocks.find(block => block.id === Number(id));
        },
        findLesson(id) {
            return this.lessons.find(lesson => lesson.id === Number(id));
        },
        findTest(id) {
            return this.tests.find(test => test.id === Number(id));
        },
        changeLoadingStatus() {
            this.isLoading = !this.isLoading;
        },
        setCourses(courses) {
            this.courses = courses;
        },
        setBlocks(blocks) {
            this.blocks = blocks;
        },
        setLessons(lessons) {
            this.lessons = lessons;
        },
        setTests(tests) {
            this.tests = tests;
        },
        saveToSessionStorage() {
            sessionStorage.setItem('data', JSON.stringify(this.$state));
        },
        restoreFromSessionStorage() {
            const data = sessionStorage.getItem('data');
            if (data) {
                this.$patch(JSON.parse(data));
            }
        },
        async fetchCourses(token) {
            this.changeLoadingStatus();
            const response = await fetch(`${this.backendUrl}/courses`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка получения данных пользователя');
            } else {
                const result = await response.json();
                this.setCourses(result.data);
                this.changeLoadingStatus();
                this.saveToSessionStorage();
            }
        },

        async fetchBlcoks(token) {
            this.changeLoadingStatus();
            const response = await fetch(`${this.backendUrl}/blocks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка получения данных');
            } else {
                const result = await response.json();
                this.setBlocks(result.data);
                this.changeLoadingStatus();
                this.saveToSessionStorage();
            }
        },

        async fetchLessons(token) {
            this.changeLoadingStatus();
            const response = await fetch(`${this.backendUrl}/lessons`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка получения данных');
            } else {
                const result = await response.json();
                this.setLessons(result.data);
                this.changeLoadingStatus();
                this.saveToSessionStorage();
            }
        },
        async fetchTests(token) {
            this.changeLoadingStatus();
            const response = await fetch(`${this.backendUrl}/tests`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка получения данных');
            } else {
                const result = await response.json();
                this.setTests(result.data);
                this.changeLoadingStatus();
                this.saveToSessionStorage();
            }
        },

        async saveAnswers(token, data, userId) {
            this.changeLoadingStatus();
            const questions = Object.entries(data).map(([questionId, userAnswer]) => {
                return {
                    user_id: userId,
                    question_id: parseInt(questionId),
                    user_answer: userAnswer
                };
            });
            const response = await fetch(`${this.backendUrl}/tests-result/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: questions
                }),
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка сохранения данных');
            } else {
                const result = await response.json();
                return result.data.id;
            }
        },

        async findResultsTest(token, id) {
            this.changeLoadingStatus();
            const response = await fetch(`${this.backendUrl}/tests-result/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error('Ошибка получения данных');
            } else {
                const result = await response.json();
                this.changeLoadingStatus();
                this.saveToSessionStorage();
                return result;
            }
        },
    },
    getters: {

    },
});
