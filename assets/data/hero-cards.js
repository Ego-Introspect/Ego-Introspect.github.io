/* Hero card manifest.
 *
 * Layout rules in this version:
 *   - No rotation on any card.
 *   - Foreground cards are arranged in a 3-column × 2-row grid and never
 *     overlap each other (column gap ~4 vw, row gap ~6 vh).
 *   - Card size varies within and across layers — not strictly "fg big, bg small".
 *   - When `image` and `video` are both null, the card renders as an iOS-26-style
 *     frosted-glass placeholder instead of a coloured panel.
 *
 * IMPORTANT — units:
 *   - position.x in % of viewport WIDTH
 *   - position.y in % of viewport HEIGHT
 *   - size.w / size.h both in VW (so the card keeps its 16:9 aspect)
 *   On a 16:9 viewport, a card's effective vertical extent is size.h × (16/9)
 *   ≈ size.h × 1.78. Account for this when placing.
 *
 * Distribution: foreground cluster spans x 28–96 (uses the right side too).
 * Mid and bg cards fill the gaps between foreground cards so the centre back
 * layer doesn't feel empty.
 *
 * Foreground (6): 3 cols × 2 rows. fg-4 / fg-6 are reserved video slots.
 * Mid (8): peek through gaps between foreground cards.
 * Bg (8): 5 are `initialVisible: true` — including two LARGE deep-centre cards
 *   so the centre back layer reads as a full canvas at scroll progress 0.
 */
window.HERO_CARDS = {
  cards: [
    /* ───────── Initially-visible ambient background cards (5) ───────── */
    {
      id: "bg-1",
      layer: "background",
      image: "assets/hero-cards/images/bg-1.png", video: null,
      scene: "Driving",
      annotation: "Note the route home through the park.",
      position: { x: 2, y: 3 },
      size: { w: 12, h: 6.8 },
      rotation: 0,
      entry: "fade",
      initialVisible: true,
    },
    {
      id: "bg-2",
      layer: "background",
      image: "assets/hero-cards/images/bg-2.png", video: null,
      scene: "Watering",
      annotation: "The orchid is blooming again.",
      position: { x: 88, y: 3 },
      size: { w: 12, h: 6.8 },
      rotation: 0,
      entry: "fade",
      initialVisible: true,
    },
    {
      id: "bg-3",
      layer: "background",
      image: "assets/hero-cards/images/bg-3.png", video: null,
      scene: "Working",
      annotation: "Clear desk, clear head.",
      position: { x: 40, y: 22 },
      size: { w: 18, h: 10.1 },
      rotation: 0,
      entry: "fade",
      initialVisible: true,
    },
    {
      id: "bg-4",
      layer: "background",
      image: "assets/hero-cards/images/bg-4.png", video: null,
      scene: "Talking",
      annotation: "Remember Lin's idea about the user flow.",
      position: { x: 38, y: 44 },
      size: { w: 22, h: 12.4 },
      rotation: 0,
      entry: "fade",
      initialVisible: true,
    },
    {
      id: "bg-5",
      layer: "background",
      image: "assets/hero-cards/images/bg-5.png", video: null,
      scene: "Reading",
      annotation: "This sentence made me pause.",
      position: { x: 4, y: 50 },
      size: { w: 14, h: 7.9 },
      rotation: 0,
      entry: "fade",
      initialVisible: true,
    },

    /* ───────── Background, fly-in (3) ───────── */
    {
      id: "bg-6",
      layer: "background",
      image: "assets/hero-cards/images/bg-6.png", video: null,
      scene: "Music",
      annotation: "Add this song to the playlist later.",
      position: { x: 62, y: 2 },
      size: { w: 14, h: 7.9 },
      rotation: 0,
      entry: "top",
      initialVisible: false,
    },
    {
      id: "bg-7",
      layer: "background",
      image: "assets/hero-cards/images/bg-7.png", video: null,
      scene: "Snacking",
      annotation: "Should pack one of these for tomorrow.",
      position: { x: 94, y: 38 },
      size: { w: 10, h: 5.6 },
      rotation: 0,
      entry: "right",
      initialVisible: false,
    },
    {
      id: "bg-8",
      layer: "background",
      image: "assets/hero-cards/images/bg-8.png", video: null,
      scene: "Walking",
      annotation: "Quiet street — good for thinking.",
      position: { x: 52, y: 88 },
      size: { w: 14, h: 7.9 },
      rotation: 0,
      entry: "top",
      initialVisible: false,
    },

    /* ───────── Mid layer (8) — slot between foreground cards ───────── */
    {
      id: "bg-9",
      layer: "mid",
      image: "assets/hero-cards/images/bg-9.png", video: null,
      scene: "Wearing",
      annotation: "I'll wear this for the wedding.",
      position: { x: 4, y: 18 },
      size: { w: 16, h: 9 },
      rotation: 0,
      entry: "left",
      initialVisible: false,
    },
    {
      id: "bg-10",
      layer: "mid",
      image: "assets/hero-cards/images/bg-10.png", video: null,
      scene: "Learning",
      annotation: "Try this experiment again next week.",
      position: { x: 44, y: 30 },
      size: { w: 16, h: 9 },
      rotation: 0,
      entry: "top",
      initialVisible: false,
    },
    {
      id: "bg-11",
      layer: "mid",
      image: "assets/hero-cards/images/bg-11.png", video: null,
      scene: "Building",
      annotation: "The hinge needs another shim.",
      position: { x: 66, y: 28 },
      size: { w: 14, h: 7.9 },
      rotation: 0,
      entry: "top",
      initialVisible: false,
    },
    {
      id: "bg-12",
      layer: "mid",
      image: "assets/hero-cards/images/bg-12.png", video: null,
      scene: "Traveling",
      annotation: "Sky was so wide here.",
      position: { x: 92, y: 14 },
      size: { w: 10, h: 5.6 },
      rotation: 0,
      entry: "right",
      initialVisible: false,
    },
    {
      id: "bg-13",
      layer: "mid",
      image: "assets/hero-cards/images/bg-13.png", video: null,
      scene: "Sharing",
      annotation: "Send this clip to mom tonight.",
      position: { x: 4, y: 42 },
      size: { w: 16, h: 9 },
      rotation: 0,
      entry: "left",
      initialVisible: false,
    },
    {
      id: "bg-14",
      layer: "mid",
      image: "assets/hero-cards/images/bg-14.png", video: null,
      scene: "Tasting",
      annotation: "Salt at the very end — chef's tip.",
      position: { x: 92, y: 50 },
      size: { w: 10, h: 5.6 },
      rotation: 0,
      entry: "right",
      initialVisible: false,
    },
    {
      id: "bg-15",
      layer: "mid",
      image: "assets/hero-cards/images/bg-15.png", video: null,
      scene: "Watching",
      annotation: "Director loves long takes in this scene.",
      position: { x: 50, y: 58 },
      size: { w: 18, h: 10.1 },
      rotation: 0,
      entry: "top",
      initialVisible: false,
    },
    {
      id: "bg-16",
      layer: "mid",
      image: "assets/hero-cards/images/bg-16.png", video: null,
      scene: "Petting",
      annotation: "Cat napped here three hours straight.",
      position: { x: 78, y: 58 },
      size: { w: 14, h: 7.9 },
      rotation: 0,
      entry: "top",
      initialVisible: false,
    },

    /* ───────── Foreground (6) — 3 cols × 2 rows, non-overlapping ───────── */
    /*
     * Column anchors (top-left x): 30 / 52 / 78 (col A / B / C)
     * Row 1 y: 8–13 (vertical extent ~18–20 vh)
     * Row 2 y: 36–39 (vertical extent ~18–22 vh)
     * Row gap: ~6 vh on 16:9
     */
    {
      id: "fg-1",
      layer: "foreground",
      image: null, video: "assets/hero-cards/videos/fg-1-2.mp4",
      scene: "Tourist Spot",
      annotation: "I need recommendations for the best local food to try in Beijing.",
      position: { x: 30, y: 12 },
      size: { w: 18, h: 10.1 },
      rotation: 0,
      entry: "fade",
      initialVisible: false,
    },
    {
      id: "fg-2",
      layer: "foreground",
      image: null, video: "assets/hero-cards/videos/fg-2.mp4",
      scene: "Dog Café",
      annotation: "I want to know how to tell a dog’s age by its appearance.",
      position: { x: 52, y: 8 },
      size: { w: 20, h: 11.25 },
      rotation: 0,
      entry: "fade",
      initialVisible: false,
    },
    {
      id: "fg-3",
      layer: "foreground",
      image: null, video: "assets/hero-cards/videos/fg-3.mp4",
      scene: "Biology Lab",
      annotation: "I’d like to record the conditions inside the cell culture hood.",
      position: { x: 78, y: 13 },
      size: { w: 18, h: 10.1 },
      rotation: 0,
      entry: "fade",
      initialVisible: false,
    },
    {
      id: "fg-4",
      layer: "foreground",
      image: null,
      video: "assets/hero-cards/videos/fg-4.mp4", /* foreground video slot — set "assets/hero-cards/videos/fg-4.mp4" when ready */
      scene: "Transportation",
      annotation: "I felt a bit stressed because I had to catch my transportation, so there was a sense of urgency.",
      position: { x: 28, y: 36 },
      size: { w: 22, h: 12.4 },
      rotation: 0,
      entry: "fade",
      initialVisible: false,
    },
    {
      id: "fg-5",
      layer: "foreground",
      image: null, video: "assets/hero-cards/videos/fg-5.mp4",
      scene: "Exhibition",
      annotation: "I was impressed by this beautiful white wooden keyboard.",
      position: { x: 54, y: 39 },
      size: { w: 18, h: 10.1 },
      rotation: 0,
      entry: "fade",
      initialVisible: false,
    },
    {
      id: "fg-6",
      layer: "foreground",
      image: null,
      video: "assets/hero-cards/videos/fg-6.mp4", /* foreground video slot — set "assets/hero-cards/videos/fg-6.mp4" when ready */
      scene: "Gym Workout",
      annotation: "I need to log how much weight I used for this dumbbell set.",
      position: { x: 76, y: 36 },
      size: { w: 20, h: 11.25 },
      rotation: 0,
      entry: "fade",
      initialVisible: false,
    },
  ],
};
