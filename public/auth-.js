// public/js/auth.js — handles login/register forms and profile bootstrap
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const { token } = await API.post("/auth/login", { username, password });
    localStorage.setItem("bc_token", token);
    window.location.href = "feed.html";
  } catch (err) {
    document.getElementById("error").textContent = err.message;
  }
});

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const { token } = await API.post("/auth/signup", { username, email, password });
    localStorage.setItem("bc_token", token);
    window.location.href = "feed.html";
  } catch (err) {
    document.getElementById("error").textContent = err.message;
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", async (e) => {
  e.preventDefault();
  await API.post("/auth/logout").catch(() => {});
  localStorage.removeItem("bc_token");
  window.location.href = "login.html";
});

// Profile page bootstrap
async function loadProfile() {
  const el = document.getElementById("profileUsername");
  if (!el) return;
  try {
    const me = await API.get("/users/me").catch(() => null);
  } catch (_) {}
}
loadProfile();
