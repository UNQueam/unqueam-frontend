import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import SomethingBroke from '../views/SomethingBroke.vue'
import GameDetailsView from "../views/GameDetailsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game/game-change-name',
      name: 'GameDetails',
      component: GameDetailsView
    },
    { 
      path: '/404',
      name: 'NotFound',
      component: NotFound 
    },
    { 
      path: '/500',
      name: 'SomethingBroke',
      component: SomethingBroke 
    },
    
    { path: '/:catchAll(.*)', redirect: '/404' }
  ]
})

export default router
