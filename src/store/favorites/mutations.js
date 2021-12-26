export function addFavoritos(state, items) {
  state.mangasFavorites.push(...items);
}

export function removeFavoritos(state, url) {
  const index = state.mangasFavorites.findIndex(fv => fv.url === url);
  state.mangasFavorites.splice(index, 1);
}
