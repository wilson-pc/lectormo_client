<template>
  <div>
    <q-header elevated>
      <q-toolbar>
        <side-menu></side-menu>

        <q-toolbar-title>
          Favoritos
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page>
      <div class="q-pa-md">
        <div align="center" v-if="error">
          <q-banner inline-actions class="text-white bg-red">
            {{ error }}
          </q-banner>
        </div>

        <div
          class="q-col-gutter-md row items-start"
          v-if="mangasFavorites.length"
        >
          <div
            class="col-6"
            v-for="(manga, index) in mangasFavorites"
            v-bind:key="manga.url + index"
          >
            <q-card class="my-card">
              <q-img
                :src="manga.cover"
                style="width: 100%"
                native-context-menu
                @click="toManga(manga.url)"
              >
              </q-img>
              <div>{{ manga.title }}</div>
            </q-card>
          </div>
        </div>
        <div v-else elign="center">
          <q-banner inline-actions class="text-white bg-red">
            Parece que no tienes favoritos en tu lista, regresa a la lista y
            agrega uno
          </q-banner>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  name: "PageIndex",
  data() {
    return { error: undefined };
  },
  async mounted() {
    // const items = await getBest(1);
    // this.mangas.push(...items);
  },
  created() {},

  methods: {
    toManga(url) {
      console.log(url);
      this.$router.push({ name: "manga", query: { url: url } });
    }
  },
  computed: {
    localComputed() {
      /* ... */
    },

    ...mapState("auth", ["user"]),
    ...mapState("favorites", ["mangasFavorites"])
  }
};
</script>
<style>
.q-img__content > div {
  padding: 6px !important;
}
.badged-manga {
  background-color: #7986cb !important;
}
</style>
