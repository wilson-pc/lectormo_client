const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", name: "index", component: () => import("pages/Index.vue") },
      {
        path: "manga",
        name: "manga",
        component: () => import("pages/Manga.vue")
      },
      {
        path: "chapter",
        name: "chapter",
        component: () => import("pages/Chapter.vue")
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/auth/Register.vue")
      },
      {
        path: "all",
        name: "all",
        component: () => import("pages/All.vue")
      },
      {
        path: "filter/:name",
        name: "filter",
        component: () => import("pages/Filter.vue")
      },
      {
        path: "favorites",
        name: "Favorites",
        component: () => import("pages/favorites.vue")
      },
      {
        path: "marcadores",
        name: "Marcadores",
        component: () => import("pages/Marcadores.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
