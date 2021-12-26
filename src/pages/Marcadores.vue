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

        <div align="center" class="q-col-gutter-md " v-if="marcadores.length">
          <q-list bordered separator>
            <q-item
              clickable
              v-ripple
              v-for="item in marcadores"
              v-bind:key="item.id"
              @click="toChapter(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.doc.capitulo }}</q-item-label>
                <q-item-label caption>{{ item.doc.date }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
import { date } from "quasar";

export default {
  name: "PageIndex",
  data() {
    return { error: undefined, marcadores: [] };
  },
  async mounted() {
    // const items = await getBest(1);
    // this.mangas.push(...items);
    this.getData();
  },
  async created() {
    try {
      const { rows } = await this.$pdb.marcadores.allDocs({
        include_docs: true
      });
      this.marcadores = rows;
      this.marcadores.map(e => {
        e.doc.date = date.formatDate(e.doc.date, "YYYY-MM-DD HH:mm:ss");
      });
      this.marcadores.sort(function(a, b) {
        return new Date(b.doc.date) - new Date(a.doc.date);
      });
    } catch (err) {
      console.log(err);
    }
  },

  methods: {
    getData() {},
    toChapter(item) {
      this.$router.push({
        name: "chapter",
        query: { url: item.id, title: item.doc.title }
      });
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
