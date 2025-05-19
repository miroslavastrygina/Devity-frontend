import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import MainScreen from '../components/MainScreen.vue'
import RegisterForm from '../components/RegisterForm.vue'
import CourseScreen from '../components/CourseScreen.vue'
import BlockScreen from '../components/BlockScreen.vue'
import LessonScreen from '../components/LessonScreen.vue'
import TestScreen from '../components/TestScreen.vue'
import ResultTestScreen from '../components/ResultTestScreen.vue'
import ProfileScreen from '../components/ProfileScreen.vue'
import AssignmentScreen from '../components/AssignmentScreen.vue'
import { useAuthStore } from '../stores/auth' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainScreen,
      meta: { breadcrumb: 'Главная' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm,
    },
    {
      path: '/course/:id',
      name: 'CourseScreen',
      component: CourseScreen,
      props: true,
      meta: { breadcrumb: 'Курсы' },
    },
    {
      path: '/block/:id',
      name: 'BlockScreen',
      component: BlockScreen,
      props: true,
      meta: { breadcrumb: 'Блоки' },
    },
    {
      path: '/lesson/:id',
      name: 'LessonScreen',
      component: LessonScreen,
      props: true,
      meta: { breadcrumb: 'Уроки' },
    },
    {
      path: '/test/:id',
      name: 'TestScreen',
      component: TestScreen,
      props: true,
      meta: { breadcrumb: 'Тесты' },
    },
    {
      path: '/assignment/:id',
      name: 'AssignmentScreen',
      component: AssignmentScreen,
      props: true,
    },
    {
      path: '/results/:id',
      name: 'ResultTestScreen',
      component: ResultTestScreen,
      props: true
    },
    {
      path: '/profile',
      name: 'ProfileScreen',
      component: ProfileScreen,
      props: true
    },
  ],
})

// Глобальный навигационный охранник
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !auth.isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
