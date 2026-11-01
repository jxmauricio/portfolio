export const site = {
  name: "John Mauricio",
  role: "Software engineer",
  company: "CoStar Group",
  email: "johnmauricio0308@gmail.com",
  linkedin: "https://www.linkedin.com/in/john-mauricio-b427a4216/",
  // [PLACEHOLDER] your GitHub login. GITHUB_USERNAME in the environment wins if set.
  githubUsername: "jxmauricio",
  // Links point at the /resume page (a tracked page view); it embeds the PDF.
  resume: "/resume",
  resumePdf: "/resume.pdf",
  // Set to "/photo-hero.jpg" / "/photo-about.jpg" once the files are in public/.
  photos: {
    hero: "/photo-about.jpg" as string | null,
    about: "/photo-about.jpg" as string | null,
  },
  hero: {
    eyebrow: "Software engineer at CoStar Group",
    headline: "I am John ;)",
  },
};

export function githubUsername() {
  return process.env.GITHUB_USERNAME || site.githubUsername;
}

export function githubUrl() {
  return `https://github.com/${githubUsername()}`;
}
