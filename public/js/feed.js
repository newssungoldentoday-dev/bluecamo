// public/js/feed.js — renders the home feed and handles posting/liking
function renderPost(post) {
  const div = document.createElement("div");
  div.className = "post-card";
  div.innerHTML = `
    <div class="author">@${post.author?.username || "unknown"}</div>
    <div class="content">${escapeHtml(post.content)}</div>
    <div class="meta">
      <span>${new Date(post.created_at).toLocaleString()}</span>
      <button class="btn like-btn" data-id="${post.id}">
        ${post.liked ? "♥" : "♡"} ${post.likeCount || 0}
      </button>
    </div>
  `;
  return div;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function loadFeed() {
  const container = document.getElementById("feed");
  if (!container) return;
  container.innerHTML = "";
  try {
    const posts = await API.get("/feed");
    posts.forEach((p) => container.appendChild(renderPost(p)));
  } catch (err) {
    container.textContent = `Couldn't load feed: ${err.message}`;
  }
}

document.getElementById("composer")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("content").value;
  if (!content.trim()) return;
  try {
    await API.post("/posts", { content });
    document.getElementById("content").value = "";
    loadFeed();
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("feed")?.addEventListener("click", async (e) => {
  const btn = e.target.closest(".like-btn");
  if (!btn) return;
  try {
    await API.post(`/likes/${btn.dataset.id}`);
    loadFeed();
  } catch (err) {
    alert(err.message);
  }
});

loadFeed();
