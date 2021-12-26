<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list class="rounded-borders">
        <q-item-label header class="text-grey-8">
          <div class="q-gutter-sm" v-if="user">
            <q-chip>
              {{ user.email }}
            </q-chip>
            <q-btn @click="salir()">
              salir
            </q-btn>
          </div>
          <div v-else>
            <q-btn :to="{ name: 'register' }">
              Registrarse
            </q-btn>
          </div>
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { LocalStorage } from "quasar";
import { mapState, mapActions } from "vuex";

const linksData = [
  {
    title: "Listar todo",
    caption: "Todos los mangas",
    icon: "list",
    name: "all"
  },
  {
    title: "Favoritos",
    caption: "Lista de mis favoritos",
    icon: "favorite",
    name: "Favorites"
  },
  {
    title: "Marcadores",
    caption: "Lista de mis marcadores",
    icon: "restore",
    name: "Marcadores"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    };
  },
  async mounted() {
    this.loadData();
    this.getFavorites();
  },
  created() {
    this.$root.$on("drawer", () => {
      this.leftDrawerOpen = true;
    });
  },
  computed: {
    localComputed() {
      /* ... */
    },

    ...mapState("auth", ["user"])
  },
  methods: {
    ...mapActions("auth", ["addAuth"]),
    ...mapActions("favorites", ["addFavoritos"]),
    async salir() {
      let current = this.$route.name;
      LocalStorage.clear();
      this.addAuth({ token: null, user: null });
      if (current != "index") {
        this.$router.replace({ name: "index" });
      }
      this.leftDrawerOpen = false;
      const { error } = await this.$supabase.auth.signOut();
    },
    async getFavorites() {
      let user = this.$supabase.auth.user();
      if (user) {
        const { data, error } = await this.$supabase
          .from("favorites")
          .select("*")
          .eq("userId", user.id);

        this.addFavoritos(data);
      }
    },
    loadData() {
      try {
        window.resolveLocalFileSystemURL(
          window.cordova.file.externalRootDirectory,
          directoryEntry => {
            var folderName = "manga reader";

            directoryEntry.getDirectory(
              folderName,
              { create: true, exclusive: false },
              suss => {
                suss.getDirectory(
                  "downloads",
                  {
                    create: true,
                    exclusive: false
                  },
                  () => {},
                  () => {}
                );
                suss.getDirectory(
                  "files",
                  {
                    create: true,
                    exclusive: false
                  },
                  () => {
                    suss.getFile(
                      "files/.nomedia",
                      {
                        create: true,
                        exclusive: false
                      },
                      () => {},
                      () => {}
                    );
                  },
                  () => {}
                );
              },
              error => {
                console.log(error);
              }
            );
          },
          err => {
            console.log(err);
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
