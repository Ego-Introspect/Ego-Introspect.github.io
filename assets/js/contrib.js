/* Ego-Introspect — Contributors & Citation section
 *   - Renders the core-contributor avatar row from a single data array.
 *   - Wires up "Copy" on the BibTeX block.
 */
(function () {
  // To add a real photo: drop the file into ./assets/contrib/ and set `photo`.
  // To add a homepage link: set `url`. Both fields are optional.
  const AVATARS = [
    { initials: "ZW", name: "Zeyu Wang",             mark: "*", grad: ["#7c5cff", "#21c1ff"], photo: "./assets/contrib/zeyu-wang.jpg",       url: "https://sky-wang326.github.io/" },
    { initials: "CL", name: "Chang Liu",             mark: "*", grad: ["#7c5cff", "#b85cff"], photo: "./assets/contrib/chang-liu.jpg",       url: "" },
    { initials: "ET", name: "Eduardus Tjitrahardja",            grad: ["#5c8bff", "#21c1ff"], photo: "./assets/contrib/eduardus-tjitrahardja.jpg", url: "https://www.edutjie.net/" },
    { initials: "BP", name: "Borislav Pavlov",                  grad: ["#5c5cff", "#21c1ff"], photo: "./assets/contrib/borislav-pavlov.jpg", url: "" },
    { initials: "FG", name: "Fangfei Gou",                      grad: ["#7c5cff", "#ff5cd6"], photo: "./assets/contrib/fangfei-gou.jpg",     url: "" },
    { initials: "JD", name: "Jose Manuel Davila",               grad: ["#5cffe0", "#21c1ff"], photo: "./assets/contrib/jose-manuel-davila.jpg", url: "" },
    { initials: "DS", name: "Dai Shi",                          grad: ["#5c5cff", "#7c5cff"], photo: "./assets/contrib/dai-shi.jpg",         url: "" },
    { initials: "RX", name: "Ran Xu",                           grad: ["#21c1ff", "#5cffd6"], photo: "./assets/contrib/ran-xu.jpg",          url: "" },
    { initials: "YW", name: "Yuntao Wang",           mark: "‡", grad: ["#a05cff", "#5c5cff"], photo: "./assets/contrib/yuntao-wang.jpg",     url: "" },
    { initials: "ML", name: "Miao Liu",              mark: "‡", grad: ["#b85cff", "#5c8bff"], photo: "./assets/contrib/miao-liu.jpg",        url: "" },
  ];

  document.addEventListener("DOMContentLoaded", () => {
    renderAvatars();
    wireCopy();
  });

  function renderAvatars() {
    const host = document.querySelector("[data-avatars]");
    if (!host) return;

    host.innerHTML = AVATARS.map((a) => {
      const mark = a.mark ? `<sup>${escapeHtml(a.mark)}</sup>` : "";

      // Circle: show photo if provided, fall back to gradient + initials.
      // On <img> error we hide the image and the initials underneath show through.
      const circleInner = a.photo
        ? `<img class="avatar__photo" src="${escapeHtml(a.photo)}" alt="${escapeHtml(a.name)}" loading="lazy" onerror="this.remove()" />` +
          `<span class="avatar__initials">${a.initials}</span>`
        : `<span class="avatar__initials">${a.initials}</span>`;

      // Name: anchor when url is set, otherwise a span.
      const nameInner = a.url
        ? `<a class="avatar__link" href="${escapeHtml(a.url)}" target="_blank" rel="noopener">${escapeHtml(a.name)}${mark}</a>`
        : `${escapeHtml(a.name)}${mark}`;

      return (
        `<div class="avatar">` +
          `<div class="avatar__circle" style="--av-a:${a.grad[0]};--av-b:${a.grad[1]}">${circleInner}</div>` +
          `<div class="avatar__name">${nameInner}</div>` +
        `</div>`
      );
    }).join("");
  }

  function wireCopy() {
    const btn = document.querySelector("[data-copy-bibtex]");
    if (!btn) return;
    const codeEl = btn.parentElement.querySelector("code");
    if (!codeEl) return;

    btn.addEventListener("click", async () => {
      const text = codeEl.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers / file:// origins
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch {}
        document.body.removeChild(ta);
      }

      const label = btn.querySelector(".contrib__copy-label");
      const original = label ? label.textContent : "";
      if (label) label.textContent = "Copied";
      btn.classList.add("is-copied");
      setTimeout(() => {
        if (label) label.textContent = original;
        btn.classList.remove("is-copied");
      }, 1400);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
})();
