function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const numberedItemPattern = /^\d+\.\s/;

function renderStoryBody(w) {
  const text = w.text || w.content || w.excerpt || "";
  if (!text) return "";

  const blocks = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const parts = [];
  let listItems = [];

  const flushList = () => {
    if (!listItems.length) return;
    parts.push(
      `<ol class="writing-numbered-list">${listItems
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ol>`
    );
    listItems = [];
  };

  for (const block of blocks) {
    if (numberedItemPattern.test(block)) {
      listItems.push(block.replace(/^\d+\.\s*/, ""));
      continue;
    }
    flushList();
    parts.push(`<p>${escapeHtml(block)}</p>`);
  }

  flushList();
  return parts.join("");
}

function getExcerpt(text, maxSentences = 2) {
  if (!text) return "";
  const cleaned = text.replace(/\n+/g, " ").trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return cleaned.slice(0, 200) + (cleaned.length > 200 ? "…" : "");
  const excerpt = sentences.slice(0, maxSentences).join(" ").trim();
  return excerpt.length < cleaned.length ? excerpt : excerpt;
}
