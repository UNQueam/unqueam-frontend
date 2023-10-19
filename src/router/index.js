import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import SomethingBroke from '../views/SomethingBroke.vue'
import GameDetailsView from "../views/GameDetailsView.vue";
import UsersView from "@/views/UsersView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import {useAuthStore} from "@/stores/authStore";
import AccessDenied from "@/views/AccessDenied.vue";
import PetitionsView from "@/views/DeveloperRequestsView.vue";
import DeveloperGames from "@/views/DeveloperGames.vue";
import NewGameFormView from "@/views/NewGameFormView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/games/:id',
      name: 'GameDetails',
      component: GameDetailsView,
      props: true
    },
    {
      path: '/dev/games',
      name: 'DeveloperGames',
      component: DeveloperGames,
      props: true,
      meta: { requiresAuth: true, requiredRole: 'developer' }
    },
    {
      path: '/dev/games/publish',
      name: 'NewGameFormView',
      component: NewGameFormView,
      props: true,
      meta: { requiresAuth: true, requiredRole: 'developer' }
    },
    {
      path: '/dev/games/:id/edit',
      name: 'EditGame',
      component: NewGameFormView,
      props: true,
      meta: { requiresAuth: true, requiredRole: 'developer' }
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/admin/users',
      name: 'Users',
      component: UsersView,
      meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
      path: '/admin/requests',
      name: 'Requests',
      component: PetitionsView,
      meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound 
    },
    {
      path: '/access-denied',
      name: 'Access Denied',
      component: AccessDenied
    },
    {
      path: '/500',
      name: 'SomethingBroke',
      component: SomethingBroke 
    },
    
    { path: '/:catchAll(.*)', redirect: '/404' }
  ]
})

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

router.beforeEach((to, from, next) => {
  scrollToTop();

  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.meta.requiredRole;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (requiresAuth && !authStore.hasRole(requiredRole)) {
    next('/access-denied');
  } else {
    next();
  }
});

export default router
