<template>
  <div>
    <q-header elevated v-if="toolbarState">
      <q-toolbar>
        <side-menu></side-menu>
        <q-toolbar-title> </q-toolbar-title>
        <q-btn
          flat
          v-if="marker"
          round
          @click="deleteMarker()"
          dense
          icon="update_disabled"
        />
        <q-btn flat v-else round dense @click="saveMarker()" icon="history" />

        <q-btn flat round dense icon="save" :disable="btndisable">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="saveToFolderPdf()">
                <q-item-section>PDF</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="saveToFolderHTML()">
                <q-item-section>HTML</q-item-section>
              </q-item>
            </q-list>
          </q-menu></q-btn
        >
        <div v-if="chapter">
          <q-btn
            v-if="chapter.next"
            flat
            round
            dense
            icon="skip_next"
            @click="nextPage()"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-page v-if="chapter" @dblclick="toolbar">
      <div
        v-for="image in chapter.images"
        v-bind:key="image.url"
        align="center"
      >
        <img v-if="image.file" :src="image.file" alt="" class="imagem" />
        <img
          align="center"
          v-else
          src="~assets/4V0b.gif"
          alt=""
          class="imagem"
        />
      </div>
    </q-page>
    <div v-else align="center">
      <img src="~assets/4V0b.gif" alt="" class="imagem" />
    </div>
  </div>
</template>

<script>
import { getChapter } from "../services/mangas.service";
import {
  makeDir,
  dowloadFile,
  checkFile,
  getFileContentAsBase64,
  saveFile
} from "../helper/cordova";
import Handlebars from "handlebars";
import { getHTML } from "../helper/converter";
import axios from "axios";
import blobStream from "blob-stream";
import { imgs2Pdf } from "../helper/imageToPdf";

export default {
  name: "PageIndex",
  data() {
    return {
      chapter: null,
      folder: undefined,
      toolbarState: true,
      btndisable: true,
      marker: null,
      currentUrl: null
    };
  },
  async mounted() {
    this.loadData();
    this.saveDb();

    //  StatusBar.overlaysWebView(true);

    AndroidFullScreen.immersiveMode(
      () => {
        console.log("sporta immersive");
      },
      errot => {
        console.log(errot);
      }
    );
  },
  beforeDestroy() {},
  methods: {
    async downloadFiles() {
      this.saveMangaInBase(this.chapter);
      for (let i = 0; i < this.chapter.images.length; i++) {
        const file = this.chapter.images[i];

        const element = file.url.trimEnd();

        let filename = element.split(".");
        let uriname =
          this.folder +
          "/" +
          ("0000" + i).substr(-4) +
          "." +
          filename[filename.length - 1];
        let exist = await checkFile(uriname);

        if (!(await checkFile(uriname))) {
          await dowloadFile(file.url, uriname, this.currentUrl.url);
          let filed = await getFileContentAsBase64(uriname);

          //  console.log(filed);
          this.chapter.images[i].file = filed;
          if (this.chapter.images.length - 1 == i) {
            this.btndisable = false;
          }
        } else {
          let filed = await getFileContentAsBase64(uriname);
          // console.log(uriname);
          this.chapter.images[i].file = filed;

          if (this.chapter.images.length - 1 == i) {
            this.btndisable = false;
          }

          // console.log(this.chapter.images[i].file);
        }
      }
    },

    toolbar() {
      this.toolbarState = this.toolbarState ? false : true;
    },
    async saveDb() {
      const { url, title } = this.$route.query;

      try {
        let capi = await this.$pdb.capitulos.put({
          _id: url,
          title: title,
          url: url
        });
      } catch (error) {}
    },
    async loadData() {
      // const items = await getBest(1);

      // this.mangas.push(...items);
      this.currentUrl = this.$route.query;

      this.$pdb.marcadores.get(this.$route.query.url).then(doc => {
        this.marker = doc;
      });

      const capi = await getChapter(this.$route.query.url);

      this.folder =
        window.cordova.file.externalRootDirectory +
        "manga reader/files/" +
        this.$route.query.title;

      if (capi.error) {
        const capi2 = await getChapter(capi.url);
        this.currentUrl.url = capi.url;
        const folder = await makeDir(this.folder, capi2.title);

        this.folder += "/" + capi2.title;

        this.chapter = capi2;
      } else {
        const folder = await makeDir(this.folder, capi.title);
        this.folder += "/" + capi.title;

        this.chapter = capi;
      }

      this.downloadFiles();
    },
    async deleteMarker() {
      try {
        let dd = await this.$pdb.marcadores
          .get(this.$route.query.url)
          .then(doc => {
            return this.$pdb.marcadores.remove(doc);
          });

        this.marker = null;
      } catch (error) {}
    },
    async saveMarker() {
      try {
        this.marker = await this.$pdb.marcadores.put({
          capitulo: this.chapter.title,
          url: this.chapter.url,
          _id: this.chapter.url,
          title: this.$route.query.title,
          date: new Date()
        });
      } catch (error) {
        console.log(error);
      }
    },
    async saveToFolderPdf() {
      let stream = imgs2Pdf(this.chapter.images, this.chapter.title).pipe(
        blobStream()
      );
      stream.on("finish", async () => {
        const pdf = stream.toBlob("application/pdf");

        try {
          await saveFile(
            window.cordova.file.externalRootDirectory +
              "manga reader/downloads/",
            this.chapter.title + ".pdf",
            pdf
          );
          this.$q.notify(
            "archivo guardado en" +
              window.cordova.file.externalRootDirectory +
              "manga reader/downloads/",
            this.chapter.title + ".pdf"
          );
        } catch (error) {
          this.$q.notify("Ocurrio un error");
        }
      });
    },
    async saveToFolderHTML() {
      let compile = Handlebars.compile(getHTML());
      let template = compile({
        title: this.chapter.title,
        images: this.chapter.images
      });

      let blob = new Blob([template], { type: "text/html" });
      // let link = document.createElement("a");
      let url = URL.createObjectURL(blob);

      try {
        await saveFile(
          window.cordova.file.externalRootDirectory + "manga reader/downloads/",
          this.chapter.title + ".html",
          blob
        );
        this.$q.notify(
          "archivo guardado en" +
            window.cordova.file.externalRootDirectory +
            "manga reader/downloads/",
          this.chapter.title + ".html"
        );
      } catch (error) {
        this.$q.notify("Ocurrio un error");
      }
    },
    nextPage() {
      this.folder = undefined;
      this.$route.query.url = this.chapter.next;
      this.chapter = null;
      this.loadData();
    },
    async saveMangaInBase(input) {
      const chap = Object.assign({}, input);

      /*
       const { data, error } = await this.$supabase
                .from("chapters")
                .insert([this.chapter]);
                */
      const prepare = {};

      if (!chap.supabase) {
        prepare.title = chap.title;
        prepare.url = chap.url;
        prepare.images = [];

        delete chap.supabase;

        const { data, error } = await this.$supabase
          .from("chapters")
          .insert([prepare]);
      } else {
        console.log("no subiendo a supabase");
      }
    }
  }
};
</script>
<style>
.imagem {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}
</style>
