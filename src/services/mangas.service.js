import { load } from "cheerio";
import supabase from "../boot/supabase";
import axios from "axios";
export function getBest(page) {
  return new Promise((resolve, reject) => {
    cordova.plugin.http.sendRequest(
      "https://lectortmo.com/populars?page=" + page,
      { method: "get" },
      response => {
        const $ = load(response.data);
        // prints 200
        let mangas = [];

        const error = $(".display-4").first();

        const manags = $(".element");
        manags.each((index, element) => {
          const link = element.children[1].attribs.href;

          const image = element.children[1].children[1].children[1].children[0].data.split(
            "'"
          )[1];

          const dd = load(element.children[1].children[1]);

          const title = dd(".text-truncate")
            .first()
            .attr().title;
          const type = dd(".book-type")
            .first()
            .text();
          const demography = dd(".demography")
            .first()
            .text();

          mangas.push({
            name: title,
            type: type,
            demography: demography,
            imagen: image,
            url: link
          });
          resolve(mangas);
          //console.log(element.children[1].attribs);
          /*
                console.log(
                  element.children[1].children[1].children[1].children[0].data.split(
                    "'"
                  )[1]
                );*/
        });
        resolve([]);
      },
      response => {
        // prints 403
        console.log(response);
        reject({ message: "errro" });
      }
    );
  });
}

export function searchManga(text, page) {
  console.log("3ntrando a busquedad");
  console.log("page", page);
  return new Promise((resolve, reject) => {
    cordova.plugin.http.sendRequest(
      `https://lectortmo.com/library?_pg=1&title=${text}&page=${page}`,
      { method: "get" },
      response => {
        // prints 200
        let mangas = [];
        const $ = load(response.data);
        const error = $(".display-4")
          .first()
          .text();
        console.log("errro", error);
        const manags = $(".element");
        manags.each((index, element) => {
          const link = element.children[1].attribs.href;

          const image = element.children[1].children[1].children[1].children[0].data.split(
            "'"
          )[1];

          const dd = load(element.children[1].children[1]);

          const title = dd(".text-truncate")
            .first()
            .attr().title;
          const type = dd(".book-type")
            .first()
            .text();
          const demography = dd(".demography")
            .first()
            .text();

          mangas.push({
            name: title,
            type: type,
            demography: demography,
            imagen: image,
            url: link
          });
          resolve(mangas);
          //console.log(element.children[1].attribs);
          /*
                console.log(
                  element.children[1].children[1].children[1].children[0].data.split(
                    "'"
                  )[1]
                );*/
        });
        resolve([]);
      },
      error => {
        // prints 403
        console.log("error", error);
        reject({ message: "errro" });
      }
    );
  });
}

export async function getMangaInfo(urlLink) {
  return new Promise(async (resolve, reject) => {
    cordova.plugin.http.sendRequest(
      urlLink,
      { method: "get" },
      response => {
        // prints 200
        let manga = {};
        const $ = load(response.data);
        const description = $(".element-description")
          .first()
          .text();
        manga.description = description;
        const title = $(".element-title")
          .first()
          .text()
          .replace(/\r?\n|\r/g, "")
          .trim();
        manga.title = title;
        const subtitle = $(".text-muted")
          .first()
          .text()
          .replace(/\\n/g, "")
          .trim();
        manga.subtitle = subtitle;
        const image = $(".book-thumbnail")
          .first()
          .attr()["data-cfsrc"];

        manga.image = image;
        const status = $(".book-status")
          .first()
          .text();
        manga.status = status;

        manga.genres = [];

        const genresTag = $(".badge");
        genresTag.each((index, element) => {
          if (element.name === "a") {
            const [tag] = element.children;

            manga.genres.push(tag.data);
          }
        });
        const caps = $(".upload-link");

        manga.chapters = [];
        caps.each((index, element) => {
          const ul = load(element);
          const number = ul(".btn-collapse")
            .first()
            .text();
          const chps = ul(".list-group-item").toArray();
          // console.log(chps.shift());

          delete chps[0];
          let versions = [];
          chps.forEach((element2, index2) => {
            const it = load(element2);
            const fansub = it(".text-truncate span a")
              .first()
              .text();
            const url = it(".text-truncate span a")
              .first()
              .attr().href;
            //  console.log(url, fansub);
            const date = it(".badge")
              .first()
              .text();
            const link = it(".btn-default").attr().href;

            versions.push({
              link: link,
              date: date,
              fansub: fansub,
              fansubUrl: url
            });
          });
          manga.chapters.push({ number: number, versions: versions });
        });
        manga.url = urlLink;
        manga.title = manga.title.replace(/:/g, "");
        manga.title = manga.title.replace(/¿/g, "");
        manga.title = manga.title.replace(/[?=]/g, "");

        resolve(manga);
      },
      response => {
        // prints 403
        console.log(response);
        reject({ message: "errro" });
      }
    );
  });
}

export function getChapter(url) {
  return new Promise(async (resolve, reject) => {
    let { data: chapters, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("url", url);

    cordova.plugin.http.sendRequest(
      url,
      { method: "get" },
      response => {
        // prints 200
        const chapter = {};

        const $ = load(response.data);
        let title = $("title")
          .first()
          .text()
          .replace(/\r?\n|\r/g, "")
          .trim();
        console.log("tttttfwety", title);
        title = title.replace(/:/g, "");
        title = title.replace(/¿/g, "");
        title = title.replace(/[?=]/g, "");

        const imges = $(".viewer-container div img");

        try {
          const next = $(".chapter-next a")
            .first()
            .attr().href;
          chapter.next = next;
        } catch (error) {}

        chapter.images = [];
        chapter.title = title;
        if (chapters.length == 0 || error || chapters[0].images.length == 0) {
          imges.each((index, element) => {
            chapter.images.push({
              local: false,
              url: element.attribs["data-src"],
              file: undefined
            });
          });
        } else {
          c;
          chapters[0].images.map(e => {
            e.file = undefined;
          });
          chapter.images.push(...chapters[0].images);
          chapter.supabase = true;
        }

        if (chapter.images.length == 1 || chapter.images.length == 0) {
          let ul = $("meta[property='og:url']").first()["0"];
          url = ul.attribs.content;
          url = url.replace("/paginated", "");
          url = url.replace("/cascade", "");
          url = url + "/cascade";
          resolve({ error: true, url: url });
        } else {
          chapter.url = url;

          chapter.title = chapter.title.replace(/:/g, "");

          resolve(chapter);
        }
      },
      response => {
        // prints 403
        console.log("ocurrio un error al descargar", response);
        reject({ message: "errro" });
      }
    );
  });
}

export function getAll(page) {
  return new Promise((resolve, reject) => {
    cordova.plugin.http.sendRequest(
      `https://lectortmo.com/library?${page}`,
      { method: "get" },
      response => {
        // prints 200
        let mangas = [];
        let genres = [];
        const $ = load(response.data);
        const error = $(".display-4")
          .first()
          .text();
        const genresCard = $("#books-genders div div div");

        genresCard.each((index, element) => {
          let hm = load(element);
          const value = hm("input")
            .first()
            .attr().value;
          const data = hm("label").first()[0].children[0].data;

          genres.push({ value: value, name: data });
        });
        const manags = $(".element");
        manags.each((index, element) => {
          const link = element.children[1].attribs.href;

          const image = element.children[1].children[1].children[1].children[0].data.split(
            "'"
          )[1];

          const dd = load(element.children[1].children[1]);

          const title = dd(".text-truncate")
            .first()
            .attr().title;
          const type = dd(".book-type")
            .first()
            .text();
          const demography = dd(".demography")
            .first()
            .text();

          mangas.push({
            name: title,
            type: type,
            demography: demography,
            imagen: image,
            url: link
          });

          //console.log(element.children[1].attribs);
          /*
                console.log(
                  element.children[1].children[1].children[1].children[0].data.split(
                    "'"
                  )[1]
                );*/
        });
        resolve({ mangas: mangas, genres: genres });
      },
      response => {
        // prints 403
        console.log(response);
        reject({ message: "errro" });
      }
    );
  });
}

export function filter(page) {
  return new Promise((resolve, reject) => {
    cordova.plugin.http.sendRequest(
      `https://lectortmo.com/library?${page}`,
      { method: "get" },
      response => {
        // prints 200
        let mangas = [];
        const $ = load(response.data);
        const error = $(".display-4")
          .first()
          .text();

        const manags = $(".element");
        manags.each((index, element) => {
          const link = element.children[1].attribs.href;

          const image = element.children[1].children[1].children[1].children[0].data.split(
            "'"
          )[1];

          const dd = load(element.children[1].children[1]);

          const title = dd(".text-truncate")
            .first()
            .attr().title;
          const type = dd(".book-type")
            .first()
            .text();
          const demography = dd(".demography")
            .first()
            .text();

          mangas.push({
            name: title,
            type: type,
            demography: demography,
            imagen: image,
            url: link
          });
          resolve(mangas);
          //console.log(element.children[1].attribs);
          /*
                console.log(
                  element.children[1].children[1].children[1].children[0].data.split(
                    "'"
                  )[1]
                );*/
        });
        resolve([]);
      },
      response => {
        // prints 403
        console.log(response);
        reject({ message: "errro" });
      }
    );
  });
}
