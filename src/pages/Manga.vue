<template>
  <div>
    <q-header elevated>
      <q-toolbar>
        <side-menu></side-menu>
        <q-toolbar-title v-if="manga">
          {{ manga.title }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page>
      <div class="q-pa-md" v-if="manga">
        <q-card class="my-card" flat bordered>
          <q-card-section class="col-5 flex flex-center">
            <q-img class="rounded-borders" :src="manga.image" />
          </q-card-section>
          <q-card-section class="col-5 flex flex-center">
            <q-chip
              v-for="genre in manga.genres"
              v-bind:key="genre"
              color="primary"
              text-color="white"
            >
              {{ genre }}
            </q-chip>
          </q-card-section>
          <q-card-section>
            <div class="q-pa-md q-gutter-sm" align="center">
              <q-btn
                v-if="
                  mangasFavorites.filter(fv => fv.url == this.manga.url).length
                "
                outline
                icon="favorite"
                style="color: goldenrod;"
                label="favorito"
                @click="rmFavoritos()"
              />
              <q-btn
                v-else
                outline
                icon="favorite_border"
                style="color: goldenrod;"
                label="favorito"
                @click="addFavorite()"
              />
            </div>
          </q-card-section>
          <q-card-section>
            <q-card-section class="q-pt-xs">
              <div class="text-h5 q-mt-sm q-mb-xs">{{ manga.title }}</div>
              <div class="text-caption text-grey">
                {{ manga.description }}
              </div>
            </q-card-section>
          </q-card-section>

          <q-separator />
        </q-card>
        <q-list bordered class="rounded-borders" v-if="manga">
          <q-expansion-item
            v-for="capitulo in manga.chapters"
            v-bind:key="capitulo.number"
            switch-toggle-side
            expand-separator
            icon="perm_identity"
            :label="capitulo.number"
          >
            <q-list bordered separator>
              <q-item
                v-for="version in capitulo.versions"
                clickable
                v-ripple
                class="text-orange"
                v-bind:key="version.link"
              >
                <q-item-section>
                  <q-item-label> {{ version.fansub }}</q-item-label>
                  <q-item-label caption> {{ version.date }}</q-item-label>
                </q-item-section>
                <q-item-section side @click="toChapter(version.link)"
                  ><q-icon name="play_arrow"
                /></q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-list>
      </div>
      <div
        v-else
        class="q-pa-md center text-center"
        align="center"
        :style="{ align: 'center', 'padding-left': ' 40%' }"
      >
        <div class="q-gutter-md row" align="center">
          <q-spinner align="center" color="primary" size="4em" :thickness="2" />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { getMangaInfo } from "../services/mangas.service";
import { makeDir } from "../helper/cordova";
import { mapGetters, mapActions, mapState } from "vuex";
import { removeFavoritos } from "src/store/favorites/mutations";
export default {
  name: "PageIndex",
  data() {
    return {
      manga: null,
      favorito: false
    };
  },
  async mounted() {
    // const items = await getBest(1);

    this.loadData();
  },
  methods: {
    ...mapGetters("manga", ["getManga"]),
    ...mapActions("manga", ["addManga"]),
    ...mapActions("favorites", ["addFavoritos"]),
    ...mapActions("favorites", ["removeFavoritos"]),
    async loadData() {
      // this.mangas.push(...items);

      let resp = this.getManga();
      let mgres = resp(this.$route.query.url);
      console.log(mgres);
      if (mgres.length === 0) {
        console.log("recargado");
        const manga = await getMangaInfo(this.$route.query.url);

        const folder = await makeDir(
          window.cordova.file.externalRootDirectory + "manga reader/files",
          manga.title
        );

        this.manga = manga;
        this.manga.chapters.map(f => {
          f.read = false;
          f.versions.map(f2 => {
            f2.read = false;
          });
        });
        console.log(this.manga);
        this.addManga(this.manga);
        this.changeState();
      } else {
        console.log("local");
        this.manga = mgres[0];
      }
    },
    async changeState() {},
    toChapter(url) {
      this.$router.push({
        name: "chapter",
        query: { url: url, title: this.manga.title }
      });
    },
    async addFavorite() {
      if (this.user) {
        const { data, error } = await this.$supabase.from("favorites").insert([
          {
            title: this.manga.title,
            url: this.manga.url,
            userId: this.user.id,
            cover: this.manga.image
          }
        ]);
        this.addFavoritos(data);
      } else {
        this.$router.push({ name: "register" });
      }
    },
    async rmFavoritos() {
      const item = this.mangasFavorites.filter(
        fv => fv.url == this.manga.url
      )[0];
      const { data, error } = await this.$supabase
        .from("favorites")
        .delete()
        .eq("id", item.id);
      this.removeFavoritos(this.manga.url);
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
<style></style>
