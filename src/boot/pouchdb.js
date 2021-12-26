// import something here
import Vue from "vue";
import PouchDB from "pouchdb";

const databse = {};
PouchDB.plugin(require("pouchdb-adapter-cordova-sqlite"));
const favorites = new PouchDB("favorites.db", { adapter: "cordova-sqlite" });
const capitulos = new PouchDB("capitulos.db", { adapter: "cordova-sqlite" });
const marcadores = new PouchDB("marcadores.db", { adapter: "cordova-sqlite" });

databse.favorites = favorites;
databse.capitulos = capitulos;
databse.marcadores = marcadores;

Vue.prototype.$pdb = databse;

export default Vue.prototype.$pdb;
