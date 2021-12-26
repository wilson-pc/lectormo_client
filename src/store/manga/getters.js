export const getManga = state => url => {
  return state.mangas.filter(m => m.url === url);
};

export const getList = state => sect => {
  return state.sections[sect];
};
