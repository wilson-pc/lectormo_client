export function addManga(context, manga) {
  context.commit("setManga", manga);
}

export function addSection(context, data) {
  context.commit("setSection", data);
}

export function addStateCapi(context, data) {
  context.commit("setCapiState", data);
}
