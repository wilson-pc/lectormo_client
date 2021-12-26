import pdb from "../../boot/pouchdb";
export function setManga(state, manga) {
  state.mangas.push(manga);
}

export function setSection(state, { section, data }) {
  state.sections[section] = data;
}

export async function setCapiState(state, { url, title }) {
  let manga = state.mangas.filter(manga => manga.title == title)[0];
  //let capitulos = pdb.capitulos.
}
