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

  // 2. Section 02 — pinned horizontal feature carousel.
  buildFeaturesCarousel();

  // 3. Snap between sections after the hero.
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

  /**
   * Section 02 — feature carousel.
   *
   * Controls:
   *   - Prev / next buttons advance one slide at a time (wrap around).
   *   - Dot indicators jump to a specific slide.
   *   - Auto-cycle: while the section is in view, advance every
   *     AUTO_INTERVAL ms. Pauses on any user interaction for
   *     AUTO_PAUSE_AFTER_USER ms before resuming.
   *
   * The horizontal slide is a plain CSS transition on .features__track
   * (driven by setting track.style.transform). No ScrollTrigger / pin —
   * the section behaves as a regular 100vh snap target vertically.
   */
  function buildFeaturesCarousel() {
    const section = document.querySelector("[data-features]");
    if (!section) return;
    const track = section.querySelector("[data-features-track]");
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = section.querySelector("[data-features-prev]");
    const nextBtn = section.querySelector("[data-features-next]");
    const dots = Array.from(section.querySelectorAll("[data-dot]"));
    if (!track || slides.length < 2) return;

    // Tune timings here.
    const AUTO_INTERVAL = 60000;        // ms between auto advances
    const AUTO_PAUSE_AFTER_USER = 60000; // ms paused after a click

    let activeIndex = 0;
    let autoTimer = null;
    let resumeTimer = null;
    let inView = false;

    function applyState() {
      // Step measured from the DOM each time so it survives resize.
      const step = slides[1].offsetLeft - slides[0].offsetLeft;
      track.style.transform = `translate3d(${-activeIndex * step}px, 0, 0)`;
      slides.forEach((s, i) =>
        s.classList.toggle("slide--active", i === activeIndex)
      );
      dots.forEach((d, i) =>
        d.classList.toggle("dot--active", i === activeIndex)
      );
    }

    function goTo(i) {
      const n = slides.length;
      activeIndex = ((i % n) + n) % n;
      applyState();
    }
    function next() { goTo(activeIndex + 1); }
    function prev() { goTo(activeIndex - 1); }

    function startAuto() {
      stopAuto();
      if (!inView) return;
      autoTimer = setInterval(next, AUTO_INTERVAL);
    }
    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }
    function pauseThenResume() {
      stopAuto();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        resumeTimer = null;
        if (inView) startAuto();
      }, AUTO_PAUSE_AFTER_USER);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prev();
        pauseThenResume();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        next();
        pauseThenResume();
      });
    }
    dots.forEach((d, i) =>
      d.addEventListener("click", () => {
        goTo(i);
        pauseThenResume();
      })
    );

    // Auto-cycle only while the section is at least half visible.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nowInView =
            entry.isIntersecting && entry.intersectionRatio >= 0.5;
          if (nowInView === inView) return;
          inView = nowInView;
          if (inView && !resumeTimer) startAuto();
          else if (!inView) stopAuto();
        });
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(section);

    // One-shot entrance for the orbit visual on slide 0. Fires a bit earlier
    // (25% visible) than the auto-cycle observer so the stat nodes finish
    // staggering in by the time the user has fully scrolled into view.
    const orbitEl = section.querySelector(".glance__orbit");
    if (orbitEl) {
      const orbitObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              orbitEl.classList.add("is-visible");
              orbitObserver.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      orbitObserver.observe(section);
    }

    // Initial render + keep correct on resize (step depends on viewport width).
    requestAnimationFrame(applyState);
    window.addEventListener("resize", applyState);
  }

  /**
   * Pairwise snap between adjacent [data-snap] sections.
   *
   * One ScrollTrigger per pair (a, b) with start = a.top@top and
   * end = b.top@top. GSAP computes those positions correctly even when
   * a or b is pinned (it uses the trigger's true document position, not
   * the live getBoundingClientRect that would read 0 during a pin).
   *
   * `snapTo` only snaps when scroll progress is within ~4% of either
   * endpoint — so the snap fires when entering/leaving the pair but does
   * NOT yank the user mid-pin (mid-carousel, mid-hero-animation, etc.).
   */
  function setupSectionSnap() {
    const snapSections = Array.from(document.querySelectorAll("[data-snap]"));
    if (snapSections.length < 2) return;

    // For a pair (a, b):
    //   - If `a` is pinned with a scrubbed timeline (hero), use a tight edge
    //     threshold so mid-pin scroll isn't yanked back to either endpoint.
    //   - Otherwise snap to whichever endpoint is closer (classic full-snap).
    const EDGE_TIGHT = 0.04;

    for (let i = 0; i < snapSections.length - 1; i++) {
      const a = snapSections[i];
      const b = snapSections[i + 1];
      const aIsPinScrub = a.hasAttribute("data-hero");

      ScrollTrigger.create({
        id: `page-snap-${i}`,
        trigger: a,
        start: "top top",
        endTrigger: b,
        end: "top top",
        snap: {
          snapTo: (progress) => {
            if (aIsPinScrub) {
              if (progress < EDGE_TIGHT) return 0;
              if (progress > 1 - EDGE_TIGHT) return 1;
              return progress;
            }
            return progress < 0.5 ? 0 : 1;
          },
          duration: { min: 0.3, max: 0.55 },
          delay: 0.08,
          ease: "power2.inOut",
        },
      });
    }
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
