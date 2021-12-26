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

export default {
  name: "PageIndex",
  data() {
    return {
      mangas: [],
      text: "",
      index: 0
    };
  },
  async mounted() {
    let query = this.$route.params.name;
    console.log(query);
  },
  methods: {
    async onLoad(index, done) {
      console.log(index);
      this.index++;
      let items = {};
      if (this.text == "") {
        items = await getAll(this.index);
      } else {
        items = await searchManga(this.text, this.index);
      }
      console.log(items.length);
      if (items.length > 1) {
        this.mangas.push(...items);
        done();
      } else {
        done(true);
      }
    },
    toManga(url) {
      console.log(url);
      this.$router.push({ name: "manga", query: { url: url } });
    },
    async search() {
      console.log(this.text);
      this.mangas = [];
      let result = await searchManga(this.text, 1);
      this.mangas.push(...result);
      this.index = 1;
      console.log(result);
    }
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
