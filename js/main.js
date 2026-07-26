async function loadContent() {
  try {
    const res = await fetch("content/content.json");
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { drawings: [], paintings: [], dance: [], books: [], writing: [] };
  }
}

function photoItem(item, caption) {
  return `
    <div class="photo" data-image="${item.image}" data-caption="${caption}">
      <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async">
      <div class="photo-caption"><span>${caption}</span></div>
    </div>`;
}

function renderDrawings(items) {
  const container = document.getElementById("drawings-gallery");
  if (!items.length) {
    container.innerHTML = `<p style="color:#666">Add items in content/content.json</p>`;
    return;
  }
  container.innerHTML = `<div class="photo-row drawings-row">${items.map((d) => photoItem(d, d.title)).join("")}</div>`;
}

function renderPaintings(items) {
  const container = document.getElementById("paintings-gallery");
  if (!items.length) {
    container.innerHTML = `<p style="color:#666">Add items in content/content.json</p>`;
    return;
  }
  container.innerHTML = `<div class="photo-row paintings-row">${items.map((p) => photoItem(p, p.title)).join("")}</div>`;
}

function youtubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : "";
}

function renderDance(items) {
  const container = document.getElementById("dance-list");
  if (!items.length) {
    container.innerHTML = `<p style="color:#666">Add items in content/content.json</p>`;
    return;
  }
  container.innerHTML = items
    .map((d) => {
      const id = youtubeId(d.url);
      if (!id) return "";
      return `
    <div class="dance-item">
      <div class="dance-video">
        <iframe
          src="https://www.youtube.com/embed/${escapeHtml(id)}"
          title="${escapeHtml(d.title)}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
      <h2 class="dance-title">${escapeHtml(d.title)}</h2>
      <p class="dance-meta"><em>${escapeHtml(d.event || "")}${d.date ? ` · ${escapeHtml(d.date)}` : ""}</em></p>
    </div>`;
    })
    .join("");
}

function renderBooks(items) {
  const container = document.getElementById("books-grid");
  if (!items.length) {
    container.innerHTML = `<p style="color:#666">Add books in content/content.json</p>`;
    return;
  }
  container.innerHTML = `<div class="photo-row books-row">${items
    .map((b) => photoItem({ ...b, image: b.cover }, b.title))
    .join("")}</div>`;
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
    <a class="writing-preview" href="writing/${escapeHtml(w.slug)}.html">
      <h2 class="writing-title">${escapeHtml(w.title)}</h2>
      <p class="writing-meta"><em>${escapeHtml(w.type)} · ${escapeHtml(w.date)}</em></p>
      <p class="writing-excerpt">${escapeHtml(getExcerpt(w.text || w.content || ""))}</p>
    </a>`
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
  renderPaintings(data.paintings || []);
  renderDance(data.dance || []);
  renderBooks(data.books);
  renderWriting(data.writing);
  initLightbox();
}

init();
