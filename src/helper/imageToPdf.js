export function imgs2Pdf(images, filename) {
  const doc = new PDFDocument({ autoFirstPage: false });
  doc.info["Title"] = `${filename}`;
  for (let index = 0; index < images.length; index++) {
    var img = doc.openImage(images[index].file);
    doc.addPage({ size: [img.width, img.height] });
    doc.image(img, 0, 0);
  }

  doc.end();

  return doc;
}
