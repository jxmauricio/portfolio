import type { Education, Role } from "./types";

export const experience: Role[] = [
  {
    company: "CoStar Group",
    title: "Full-stack Software Engineer",
    team: "E-Commerce",
    start: "Jul 2023",
    end: "Present",
    highlights: [
      "Re-architected a Hangfire job into a scalable .NET Background Service, raising throughput 46x from 173 to 8,000 listings per minute.",
      "Led the migration of LoopNet ads to Stripe, covering $4M in annual gross sales across 11,000+ accounts.",
      "Cut pricing API response times by 95% with Memcached and Redis caching.",
      "Used 63% fewer engineering hours (195 of 310) on a spec-driven modernization to React 19, TypeScript, and Vite with Claude Code.",
      "Built a Claude Code agent skill that the whole team adopted.",
      "Built a price-change detection system that enabled $461,160 in annualized revenue.",
    ],
  },
  {
    company: "Symba",
    title: "Data Science Intern",
    start: "Jun 2022",
    end: "Jul 2023",
    highlights: [
      "Automated billing notifications with GitHub Actions and Python, cutting manual effort by 50%.",
    ],
  },
  {
    company: "ID Tech",
    title: "Instructor",
    start: "Summer 2023",
    end: "",
    highlights: ["Taught applied machine learning with scikit-learn."],
  },
  {
    company: "UC San Diego",
    title: "Machine Learning Researcher",
    start: "Summer 2022",
    end: "",
    highlights: ["Worked on image segmentation with TensorFlow and OpenCV."],
  },
];

export const education: Education = {
  school: "UC San Diego",
  degree: "B.S. Data Science, Machine Learning",
  start: "2019",
  end: "2023",
};
