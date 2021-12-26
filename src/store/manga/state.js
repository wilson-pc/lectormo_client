export default function() {
  return {
    mangas: [],
    sections: {
      index: { text: "", list: [], page: 0 },
      all: { text: "", list: [], page: 0, tag: "all", filter: "", genres: [] }
    }
  };
}
