async function loadContent() {
  try {
    const res = await fetch("content/content.json");
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { drawings: [], books: [], writing: [] };
  }
}

function chunk(arr, size) {
  const rows = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

function photoItem(item, caption) {
  return `
    <div class="photo" data-image="${item.image}" data-caption="${caption}">
      <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
      <div class="photo-caption"><span>${caption}</span></div>
    </div>`;
}

function renderRows(container, items, captionFn) {
  if (!items.length) {
    container.innerHTML = `<p style="color:#666">Add items in content/content.json</p>`;
    return;
  }
  container.innerHTML = chunk(items, 3)
    .map((row) => `<div class="photo-row">${row.map((item) => photoItem(item, captionFn(item))).join("")}</div>`)
    .join("");
}

function renderDrawings(items) {
  const container = document.getElementById("drawings-gallery");
  if (!items.length) {
    container.innerHTML = `<p style="color:#666">Add items in content/content.json</p>`;
    return;
  }
  container.innerHTML = `<div class="photo-row drawings-row">${items.map((d) => photoItem(d, d.title)).join("")}</div>`;
}

function renderBooks(items) {
  renderRows(
    document.getElementById("books-grid"),
    items.map((b) => ({ ...b, image: b.cover })),
    (b) => b.title
  );
}

function renderWriting(items) {
  const el = document.getElementById("writing-list");
  if (!items.length) {
    el.innerHTML = `<p style="color:#666">Add writing in content/content.json</p>`;
    return;
  }
  el.innerHTML = items
    .map(
      (w) => `
    <div class="writing-item">
      <p><strong>${w.title}</strong> <em>· ${w.type}, ${w.date}</em></p>
      <p>${w.excerpt}</p>
    </div>`
    )
    .join("");
}

function initLightbox() {
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-caption");

  document.addEventListener("click", (e) => {
    const photo = e.target.closest(".photo");
    if (!photo) return;
    img.src = photo.dataset.image;
    img.alt = photo.dataset.caption;
    cap.textContent = photo.dataset.caption;
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("open"));
    document.body.style.overflow = "hidden";
  });

  const close = () => {
    box.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { box.hidden = true; img.src = ""; }, 200);
  };

  box.querySelector(".lightbox-close").addEventListener("click", close);
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && box.classList.contains("open")) close();
  });
}

async function init() {
  const data = await loadContent();
  renderDrawings(data.drawings);
  renderBooks(data.books);
  renderWriting(data.writing);
  initLightbox();
}

init();
