export const site = {
  name: "John Mauricio",
  role: "Full-stack engineer",
  company: "CoStar Group",
  email: "johnmauricio0308@gmail.com",
  linkedin: "https://www.linkedin.com/in/john-mauricio-b427a4216/",
  // [PLACEHOLDER] your GitHub login. GITHUB_USERNAME in the environment wins if set.
  githubUsername: "[PLACEHOLDER]",
  resume: "/resume.pdf",
  // Set to "/photo-hero.jpg" / "/photo-about.jpg" once the files are in public/.
  photos: {
    hero: null as string | null, // [PLACEHOLDER]
    about: null as string | null, // [PLACEHOLDER]
  },
  hero: {
    eyebrow: "Full-stack engineer at CoStar Group",
    headline: "I build software that moves money and stays fast.",
    intro:
      "I work on the E-Commerce team behind LoopNet ads, where I led the move to Stripe and rebuilt a listings job to handle 46 times the throughput. On the side I'm building Bankr, an AI-first personal finance app.",
  },
  about: {
    teaser:
      "I studied data science at UC San Diego, did machine learning research, taught applied ML at ID Tech, and then fell for shipping product. Now I split my time between payments work at CoStar and building Bankr in public.",
    paragraphs: [
      "I'm a full-stack engineer on CoStar Group's E-Commerce team, where I've worked since July 2023. Most of my work sits where money and performance meet: billing, pricing, and the background jobs that keep listings flowing.",
      "Before that I studied Data Science with a focus on machine learning at UC San Diego. I spent a summer doing image segmentation research with TensorFlow and OpenCV, interned at Symba automating billing notifications, and taught applied machine learning with scikit-learn at ID Tech.",
      "Bankr is where those two halves meet. It's an AI-first personal finance app, and the main thing I care about is that its answers are right. Every dollar figure it shows is traced back to a source.",
      "[PLACEHOLDER] A line or two about life outside of code.",
    ],
  },
};

export function githubUsername() {
  return process.env.GITHUB_USERNAME || site.githubUsername;
}

export function githubUrl() {
  return `https://github.com/${githubUsername()}`;
}
