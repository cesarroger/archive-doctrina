export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  description: string;
  category: string;
  year: string;
  duration: string;
  location: string;
  accent: string;
  posterAccent: string;
  frameTone: string;
  videoUrl: string;
  position: [number, number, number];
  rotationY: number;
  detailSections: Array<{
    heading: string;
    body: string;
  }>;
};

export const projects: Project[] = [
  {
    id: "aureline",
    slug: "aureline-memory-study",
    title: "Aureline Memory Study",
    tagline: "A meditation on preservation, distortion, and luminous recall.",
    shortDescription:
      "A drifting visual essay exploring how archival fragments mutate when memory becomes the editor.",
    description:
      "Aureline Memory Study layers gestures of sculpture, light, and slowed image movement into a precise emotional system. The work examines how cultural memory becomes both artifact and invention the moment it is revisited.",
    category: "Film Installation",
    year: "2026",
    duration: "08:42",
    location: "Los Angeles / Online",
    accent: "#d9c9b7",
    posterAccent: "#d6c7b2",
    frameTone: "#f5efe5",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    position: [-34, 8.6, -36],
    rotationY: 0.12,
    detailSections: [
      {
        heading: "Premise",
        body:
          "The film constructs an impossible archive, where each object appears fully preserved while quietly slipping beyond certainty. That friction becomes the emotional center of the piece.",
      },
      {
        heading: "Direction",
        body:
          "Archive Doctrina treated the project like an exhibition score rather than a conventional promo. Every cut was designed to feel held, deliberate, and almost architectural.",
      },
    ],
  },
  {
    id: "vellum",
    slug: "vellum-index",
    title: "Vellum Index",
    tagline: "A motion language for an object catalog that never settles.",
    shortDescription:
      "An editorial system translating material research, scanning rituals, and tactile interfaces into a moving index.",
    description:
      "Vellum Index operates between interface design and cinematic object study. The project frames cataloging as performance: part museum handling protocol, part living brand world.",
    category: "Creative Direction",
    year: "2025",
    duration: "11:10",
    location: "Paris / New York",
    accent: "#c2d4db",
    posterAccent: "#b7cfd9",
    frameTone: "#edf3f4",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    position: [39, 11.4, -56],
    rotationY: -0.08,
    detailSections: [
      {
        heading: "System",
        body:
          "Typography, object labels, motion transitions, and scan behaviors were designed as one interdependent language so the archive always feels authored rather than automated.",
      },
      {
        heading: "Result",
        body:
          "The final world balances restraint with tactility, turning inventory into atmosphere and interface into a kind of ceremonial viewing room.",
      },
    ],
  },
  {
    id: "monograph",
    slug: "monograph-for-future-light",
    title: "Monograph For Future Light",
    tagline: "Spatial storytelling for a publication imagined as an illuminated room.",
    shortDescription:
      "A hybrid publication concept in which text, still image, and moving light behave like one continuous installation.",
    description:
      "This concept extends the logic of a monograph into a spatial medium. Rather than documenting work after the fact, it stages the publication itself as a live environment with cinematic thresholds and evolving surfaces.",
    category: "Worldbuilding",
    year: "2026",
    duration: "06:18",
    location: "Milan",
    accent: "#d7d1c6",
    posterAccent: "#d8d0c1",
    frameTone: "#f2ede5",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
    position: [6, 18, -96],
    rotationY: 0.015,
    detailSections: [
      {
        heading: "Approach",
        body:
          "The studio developed the work as a calm sequence of thresholds. Every transition slows the viewer down and keeps focus on light, scale, and atmosphere rather than information density.",
      },
      {
        heading: "Craft",
        body:
          "Material finishes stay intentionally near-white so the slightest reflection, shadow, or movement reads with disproportionate richness.",
      },
    ],
  },
];

export const projectsBySlug = new Map(projects.map((project) => [project.slug, project]));
