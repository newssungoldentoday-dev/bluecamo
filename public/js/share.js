// share.js — Bluecamo social share utilities
// No dependencies. Works in any modern browser, no build step needed.

const Bluecamo = {
  pageUrl: () => window.location.href,
  pageTitle: () => document.title,

  share(platform, opts = {}) {
    const url = encodeURIComponent(opts.url || this.pageUrl());
    const text = encodeURIComponent(opts.text || this.pageTitle());

    const links = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };

    if (!links[platform]) {
      console.warn(`Bluecamo.share: unknown platform "${platform}"`);
      return;
    }

    window.open(links[platform], "_blank", "noopener,noreferrer,width=600,height=500");
  },

  async copyLink(opts = {}) {
    const url = opts.url || this.pageUrl();
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      console.error("Bluecamo.copyLink failed:", err);
      return false;
    }
  },

  // Uses native OS share sheet on mobile if available, falls back to copyLink
  async nativeShare(opts = {}) {
    const data = {
      title: opts.title || this.pageTitle(),
      text: opts.text || "",
      url: opts.url || this.pageUrl(),
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        if (err.name !== "AbortError") console.error("Bluecamo.nativeShare failed:", err);
        return false;
      }
    } else {
      return this.copyLink(opts);
    }
  },

  // Auto-wires any element with [data-share="platform"] to share on click
  init() {
    document.querySelectorAll("[data-share]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const platform = el.dataset.share;
        if (platform === "native") this.nativeShare();
        else if (platform === "copy") {
          this.copyLink().then((ok) => {
            if (ok) el.textContent = "Copied!";
          });
        } else this.share(platform);
      });
    });
  },
};

document.addEventListener("DOMContentLoaded", () => Bluecamo.init());
