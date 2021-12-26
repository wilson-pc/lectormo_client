/*
export function someAction (context) {
}
*/
export function addFavoritos(context, items) {
  context.commit("addFavoritos", items);
}

export function removeFavoritos(context, url) {
  context.commit("removeFavoritos", url);
}
