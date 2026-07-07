async function loadContent() {
  try {
    const res = await fetch("../content/content.json");
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return { writing: [] };
  }
}

function renderArticle(w) {
  const article = document.getElementById("writing-article");
  if (!w) {
    article.innerHTML = `<p style="color:#666">Writing not found.</p>`;
    document.title = "Not found — Aashna Agarwal";
    return;
  }

  document.title = `${w.title} — Aashna Agarwal`;

  article.innerHTML = `
    <header class="writing-page-header">
      <h1 class="writing-page-title">${escapeHtml(w.title)}</h1>
      <p class="writing-meta"><em>${escapeHtml(w.type)} · ${escapeHtml(w.date)}</em></p>
    </header>
    <div class="writing-body">${renderStoryBody(w)}</div>`;
}

async function init() {
  const slug = document.body.dataset.writingSlug;
  const data = await loadContent();
  const piece = data.writing.find((w) => w.slug === slug);
  renderArticle(piece);
}

init();
