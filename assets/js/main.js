/* Ego-Introspect — homepage scrollytelling
 *
 * Behavior:
 *   - Hero is pinned for ~2 viewports of scroll.
 *   - During pin, a scrubbed timeline runs 3 stages:
 *       Stage 1 (0.00 – 0.22): foreground cards fade in
 *       Stage 2 (0.22 – 0.65): mid + background cards float in from top/right/far
 *       Stage 3 (0.65 – 0.95): annotation text on every card fades in
 *   - After pin releases, every [data-snap] section snaps to the viewport.
 */
(function () {
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Take over wheel / trackpad input so ScrollTrigger can reliably detect
  // "scroll stopped" — without this, trackpad inertia keeps scroll velocity
  // > 0 for hundreds of ms and the snap delay never fires.
  ScrollTrigger.normalizeScroll(true);

  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  // 1. Render cards from manifest, then build the scrubbed timeline.
  if (window.HERO_CARDS && Array.isArray(window.HERO_CARDS.cards)) {
    renderCards(hero, window.HERO_CARDS.cards);
  }
  buildHeroTimeline(hero);

  // 2. Snap between sections after the hero.
  setupSectionSnap();

  // Recompute positions after fonts/images settle.
  window.addEventListener("load", () => ScrollTrigger.refresh());

  // ─────────────────────────────────────────────────────────────────────────

  function renderCards(hero, cards) {
    const layer = hero.querySelector("[data-cards-layer]");
    if (!layer) return;

    cards.forEach((c, i) => {
      const el = document.createElement("div");
      el.className = `card card--${c.layer || "mid"}`;
      el.dataset.layer = c.layer || "mid";
      el.dataset.entry = c.entry || "fade";
      if (c.initialVisible) el.dataset.initial = "visible";

      el.style.left = `${c.position.x}%`;
      el.style.top = `${c.position.y}%`;
      el.style.width = `${c.size.w}vw`;
      el.style.height = `${c.size.h}vw`;

      // Adaptive media gap: 3% of the card's own width. A 22vw card gets
      // ~0.66vw (~10px on a 1440-wide screen), a 10vw card gets ~0.3vw (~4px).
      // Tune by editing the multiplier (0.03) below.
      el.style.setProperty("--media-gap", `${c.size.w * 0.03}vw`);

      // Media: image takes priority for poster; <video> when a video src is set;
      // otherwise no media element — the card itself renders as a glass placeholder.
      // Real media is wrapped in .card__media-wrap so we can paint a frosted
      // halo (::after) along its inner edges.
      let mediaHtml = "";
      if (c.video) {
        const poster = c.image ? ` poster="${c.image}"` : "";
        mediaHtml = `<div class="card__media-wrap"><video class="card__media" autoplay muted loop playsinline preload="metadata"${poster}><source src="${c.video}" type="video/mp4" /></video></div>`;
      } else if (c.image) {
        mediaHtml = `<div class="card__media-wrap"><img class="card__media" src="${c.image}" alt="" loading="lazy" decoding="async" /></div>`;
      } else {
        el.classList.add("card--placeholder");
      }

      const tagHtml = c.scene
        ? `<div class="card__tag">${renderIcon(c)}<span>${escapeHtml(c.scene)}</span></div>`
        : "";
      const annoHtml = c.annotation
        ? `<div class="card__annotation">${escapeHtml(c.annotation)}</div>`
        : "";

      el.innerHTML = `${mediaHtml}${tagHtml}${annoHtml}`;
      layer.appendChild(el);
    });
  }

  function buildHeroTimeline(hero) {
    const fgEntering = hero.querySelectorAll(
      '.card--foreground:not([data-initial="visible"])'
    );
    const floatIn = hero.querySelectorAll(
      '.card--mid:not([data-initial="visible"]), .card--background:not([data-initial="visible"])'
    );
    const enteringCards = hero.querySelectorAll(
      '.card:not([data-initial="visible"])'
    );
    const annotations = hero.querySelectorAll(".card__annotation");

    // ── Initial state for entering cards (before scroll progress > 0) ──
    enteringCards.forEach((el) => {
      const entry = el.dataset.entry || "fade";
      const init = { autoAlpha: 0 };
      if (entry === "top") init.yPercent = -160;
      else if (entry === "right") init.xPercent = 160;
      else if (entry === "left") init.xPercent = -160;
      else if (entry === "far") init.scale = 0.35;
      gsap.set(el, init);
    });

    // All annotations start hidden — they reveal in Stage 3.
    gsap.set(annotations, { autoAlpha: 0, y: 8 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "+=140%", // pin distance — full scroll budget for reveal + buffer
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      },
    });

    // Timeline layout (relative time units):
    //   Stage 1 (fg fade in):       0.00 – 0.23      (snappy)
    //   Stage 2 (mid/bg float in):  0.13 – 0.38      (tight stagger)
    //   Stage 3 (annotations in):   0.34 – 0.57      (tight stagger)
    //   Buffer  (no visible change): 0.57 – 1.17     (hold final state)
    // The buffer occupies roughly half the pin distance so the user can keep
    // scrolling for a while after everything appears — without it, a fast
    // wheel flick would whip past the annotations before they're readable.

    // ── Stage 1: foreground cards fade in ───────────────────────────────
    if (fgEntering.length) {
      tl.to(
        fgEntering,
        {
          autoAlpha: 1,
          duration: 0.10,
          stagger: 0.025,
          ease: "none",
        },
        0
      );
    }

    // ── Stage 2: mid + bg cards float in from various directions ────────
    floatIn.forEach((el, i) => {
      const entry = el.dataset.entry || "fade";
      const target = { autoAlpha: 1, duration: 0.13, ease: "none" };
      if (entry === "top") target.yPercent = 0;
      else if (entry === "right") target.xPercent = 0;
      else if (entry === "left") target.xPercent = 0;
      else if (entry === "far") target.scale = 1;
      tl.to(el, target, 0.13 + i * 0.012);
    });

    // ── Stage 3: annotations appear on every card ──────────────────────
    if (annotations.length) {
      tl.to(
        annotations,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.10,
          stagger: 0.006,
          ease: "none",
        },
        0.34
      );
    }

    // ── Buffer: extend the timeline past Stage 3 so the pin holds the
    // final state. The tween targets a dummy object so nothing visible
    // changes — it just claims scroll real-estate. Tune `duration` to make
    // the hold longer (more reading time) or shorter (faster unpin).
    const heroHold = { _: 0 };
    tl.to(heroHold, { _: 1, duration: 0.6, ease: "none" });
  }

  function setupSectionSnap() {
    const snapSections = Array.from(document.querySelectorAll("[data-snap]"));
    if (snapSections.length < 2) return;

    ScrollTrigger.create({
      id: "page-snap",
      trigger: snapSections[0],
      start: "top top",
      endTrigger: snapSections[snapSections.length - 1],
      end: "top top",
      snap: {
        snapTo: (progress, self) => {
          const range = self.end - self.start;
          if (range <= 0) return progress;
          const positions = snapSections.map(
            (el) => el.getBoundingClientRect().top + window.scrollY
          );
          const current = self.start + progress * range;
          const closest = positions.reduce((prev, curr) =>
            Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
          );
          return (closest - self.start) / range;
        },
        duration: { min: 0.3, max: 0.6 },
        delay: 0.05,
        ease: "power2.inOut",
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers

  /**
   * Resolve and render the scene-tag icon for a card.
   * Lookup order: card.icon → card.scene.toLowerCase() → "default".
   * Returns an empty string if no registry is loaded.
   */
  function renderIcon(card) {
    const registry = window.HERO_ICONS;
    if (!registry) return "";
    const key =
      (card.icon && String(card.icon).toLowerCase()) ||
      (card.scene && String(card.scene).toLowerCase()) ||
      "default";
    const inner = registry[key] || registry.default || "";
    if (!inner) return "";
    return (
      `<svg class="card__tag-icon" viewBox="0 0 16 16" fill="none" ` +
      `stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ` +
      `stroke-linejoin="round" aria-hidden="true">${inner}</svg>`
    );
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
})();
