import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
    state: () => ({
        courses: null,
        blocks: null,
        lessons: null,
        tests: null,
        assignments: null,
        results: null,
        isLoading: false,
        backendUrl: import.meta.env.VITE_APP_BACKEND
    }),
    actions: {
        findCourse(id) {
            if (!this.courses) {
                return undefined;
            }
            return this.courses.find(course => course.id === Number(id));
        },
        findBlock(id) {
            if (!this.blocks) {
                return undefined;
            }
            return this.blocks.find(block => block.id === Number(id));
        },
        findLesson(id) {
            if (!this.lessons) {
                return undefined;
            }
            const nid = Number(id);
            return this.lessons.find((lesson) => Number(lesson.id) === nid);
        },
        findTest(id) {
            if (!this.tests) {
                return undefined;
            }
            return this.tests.find(test => test.id === Number(id));
        },
        findAssignment(id) {
            if (!this.assignments) {
                return undefined;
            }
            return this.assignments.find(assignment => assignment.id === Number(id));
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
        setAssignment(assignments) {
            this.assignments = assignments;
        },
        setResult(results) {
            this.results = results;
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

        /** Один урок с бэка (полные compiler_blocks, block_id, relations) — мержим в список. */
        async fetchLesson(token, lessonId) {
            const id = Number(lessonId);
            if (Number.isNaN(id)) {
                return;
            }
            const response = await fetch(`${this.backendUrl}/lessons/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                mode: 'cors',
            });
            if (!response.ok) {
                console.error('Ошибка загрузки урока', id);
                return;
            }
            const result = await response.json();
            if (!result.success || result.data == null) {
                return;
            }
            const incoming = result.data;
            const prev = this.lessons ? [...this.lessons] : [];
            const nid = Number(incoming.id);
            const idx = prev.findIndex((l) => Number(l.id) === nid);
            if (idx >= 0) {
                prev[idx] = { ...prev[idx], ...incoming };
            } else {
                prev.push(incoming);
            }
            this.setLessons(prev);
            this.saveToSessionStorage();
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

        async fetchAssignments(token) {
            this.changeLoadingStatus();
            const response = await fetch(`${this.backendUrl}/assignment`, {
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
                this.setAssignment(result.data);
                this.changeLoadingStatus();
                this.saveToSessionStorage();
            }
        },
        async fetchAssignmentsResults(token, id) {
            this.changeLoadingStatus();
            const response = await fetch(`${this.backendUrl}/assignment-submission/grades-by-student/${id}`, {
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
                this.setResult(result.data);
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

        async uploadAssignmentFile(token, payload) {
            const formData = new FormData();

            // добавляем все данные
            formData.append('file', payload.file);
            formData.append('assignment_id', payload.assignment_id);
            formData.append('user_id', payload.user_id);
            formData.append('submitted_at', payload.submitted_at);

            try {
                const response = await fetch(`${this.backendUrl}/assignment-submission/create`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData
                });

                if (!response.ok) {
                    console.error('Ошибка при загрузке файла');
                    return;
                }

                const result = await response.json();
                console.log('Файл успешно загружен:', result);
            } catch (error) {
                console.error('Ошибка при отправке файла:', error);
            }
        }
    },
    getters: {

    },
});
