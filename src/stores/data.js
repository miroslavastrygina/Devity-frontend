import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
    state: () => ({
        courses: null,
        blocks: null,
        lessons: null,
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
        }
    },
    getters: {

    },
});
