<template>
  <div>
    <q-header elevated>
      <q-toolbar>
        <side-menu></side-menu>
        <q-input
          dark
          dense
          standout
          v-model="text"
          class="q-ml-md"
          @keydown.enter.prevent="search()"
        >
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="text = ''"
            />
          </template>
        </q-input>
        <q-btn flat round dense icon="more_vert">
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable>
                <q-item-section>tipos</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item clickable v-close-popup @click="toType('Manga')">
                      <q-item-section>Manga</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toType('Manhua')">
                      <q-item-section>Manhua</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toType('Manhwa')">
                      <q-item-section>Manhwa</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toType('novel')">
                      <q-item-section>Novela</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="toType('Doujinshi')"
                    >
                      <q-item-section>Doujinshi</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-item clickable>
                <q-item-section>Demografia</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item clickable v-close-popup @click="toDemo('Seinen')">
                      <q-item-section>Seinen</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toDemo('Shoujo')">
                      <q-item-section>Shoujo</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toDemo('Shounen')">
                      <q-item-section>Shounen</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toDemo('Josei')">
                      <q-item-section>Josei</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toDemo('Josei')">
                      <q-item-section>Josei</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="toDemo('Kodomo')">
                      <q-item-section>Kodomo</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <q-item clickable>
                <q-item-section>Generos</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item
                      v-for="gen in genres"
                      v-bind:key="gen.value"
                      clickable
                      v-close-popup
                      @click="toGenre(gen.value)"
                    >
                      <q-item-section>{{ gen.name }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>

              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page>
      <div class="q-pa-md">
        <q-infinite-scroll @load="onLoad">
          <div class="q-col-gutter-md row items-start">
            <div
              class="col-6"
              v-for="(manga, index) in mangas"
              v-bind:key="manga.url + index"
            >
              <q-img
                :src="manga.imagen"
                style="width: 100%"
                native-context-menu
                @click="toManga(manga.url)"
              >
                <div class="absolute-bottom text-subtitle1 text-center">
                  {{ manga.demography }}
                </div>
                <div
                  class="absolute-top text-truncate"
                  :style="{ overflow: 'hidden', 'white-space': 'nowrap' }"
                >
                  {{ manga.name }}
                </div>
                <div
                  class="absolute all-pointer-events badged-manga"
                  size="32px"
                  color="white"
                  style="top: 40px; left: 8px"
                >
                  {{ manga.type }}
                </div>
              </q-img>
            </div>
          </div>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px"></q-spinner-dots>
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </q-page>
  </div>
</template>

<script>
import { getAll, searchManga } from "../services/mangas.service";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PageIndex",
  data() {
    return {
      mangas: [],
      text: "",
      index: 0,
      error: undefined,
      tag: "all",
      filter: "",
      genres: []
    };
  },
  async mounted() {},
  created() {
    let getter = this.getList();

    let data = JSON.parse(JSON.stringify(getter("all")));
    console.log(data);
    this.text = data.text;
    this.index = data.page;
    this.mangas = data.list;
    this.tag = data.tag;
    this.genres = data.genres;
    this.filter = data.filter;
  },
  methods: {
    ...mapGetters("manga", ["getList"]),
    ...mapActions("manga", ["addSection"]),
    async onLoad(index, done) {
      try {
        this.index++;
        let items = {};
        if (this.text == "") {
          console.log("all", this.tag);
          if (this.tag == "all") {
            items = await getAll(
              `order_item=alphabetically&order_dir=asc&_pg=1&page=${this.index} `
            );
          } else if (this.tag == "type") {
            items = await getAll(
              `order_item=alphabetically&order_dir=asc&type=${this.filter.toLowerCase()}&filter_by=title&_pg=1&page=${
                this.index
              } `
            );
          } else if (this.tag == "genre") {
            items = await getAll(
              `order_item=alphabetically&order_dir=asc&filter_by=title&genders%5B0%5D=${this.filter}&_pg=1&page=${this.index}`
            );
          } else if (this.tag == "demo") {
            items = await getAll(
              `order_item=alphabetically&order_dir=asc&demography=${this.filter.toLowerCase()}&filter_by=title&_pg=1&page=${
                this.index
              }`
            );
          }
        } else {
          items = await searchManga(this.text, this.index);
        }
        console.log(items.length);
        this.genres = items.genres;
        if (items.mangas.length > 1) {
          this.mangas.push(...items.mangas);
          done();
        } else {
          done(true);
        }
      } catch (error) {
        this.error = "ocurrio un error en el servidor, regrese mas tarde";
        done(true);
      }
    },
    toManga(url) {
      this.$router.push({ name: "manga", query: { url: url } });
    },
    async search() {
      this.mangas = [];
      let result = await searchManga(this.text, 1);
      this.mangas.push(...result.mangas);
      this.index = 1;
    },
    async toType(filter) {
      this.$q.loading.show();

      this.filter = filter;
      this.tag = "type";
      this.mangas = [];
      let result = await getAll(
        `order_item=alphabetically&order_dir=asc&type=${this.filter.toLowerCase()}&filter_by=title&_pg=1&page=1`
      );
      this.mangas.push(...result.mangas);
      this.index = 1;
      this.$q.loading.hide();
    },
    async toGenre(genre) {
      this.$q.loading.show();

      this.filter = genre;
      this.tag = "genre";
      this.mangas = [];
      let result = await getAll(
        `order_item=alphabetically&order_dir=asc&filter_by=title&genders%5B0%5D=${genre}&_pg=1&page=1`
      );
      this.mangas.push(...result.mangas);
      this.index = 1;
      this.$q.loading.hide();
    },
    async toDemo(demo) {
      this.$q.loading.show();

      this.filter = demo;
      this.tag = "demo";
      this.mangas = [];
      let result = await getAll(
        `order_item=alphabetically&order_dir=asc&demography=${this.filter.toLowerCase()}&filter_by=title&_pg=1&page=1`
      );
      this.mangas.push(...result.mangas);
      this.index = 1;
      this.$q.loading.hide();
    },
    async toEstado(estado) {
      this.$q.loading.show();

      this.filter = estado;
      this.tag = "estado";
      this.mangas = [];
      let result = await getAll(
        `order_item=alphabetically&order_dir=asc&demography=${this.filter.toLowerCase()}&filter_by=title&_pg=1&page=1`
      );
      this.mangas.push(...result.mangas);
      this.index = 1;
      this.$q.loading.hide();
      console.log(result);
    }
  },
  beforeDestroy() {
    this.addSection({
      section: "all",
      data: {
        text: this.text,
        list: this.mangas,
        page: this.index,
        tag: this.tag,
        filter: this.filter,
        genres: this.genres
      }
    });
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
