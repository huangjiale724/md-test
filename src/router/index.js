import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    component: () => import("@/views/home.vue")
  },
  {
    path: "/cherry-markdown",
    component: () => import("@/views/cherry-markdown.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
