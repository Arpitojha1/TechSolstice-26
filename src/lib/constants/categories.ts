export type EventCategory = {
  id: string;
  title: string;
  slug: string;
  dbValue: string; // Exact value from database enum
  description: string;
  icon?: string;
  gradient: string;
};

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: "coding-dev",
    title: "Coding & Dev",
    slug: "coding-dev",
    dbValue: "Coding and Development",
    description: "Hackathons and competitive coding battles. Prove your logic dominates the syntax.",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
  },
  {
    id: "robotics-hardware",
    title: "Robotics & Hardware",
    slug: "robotics-hardware",
    dbValue: "Robotics and Hardware",
    description: "Drone racing, line followers, and combat bots. Witness metal clash and circuits spark.",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    id: "finance-strategy",
    title: "Finance & Strategy",
    slug: "finance-strategy",
    dbValue: "Finance and Strategy",
    description: "Master the markets. Where high stakes meet sharp business acumen and strategy.",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    id: "quizzes-tech-games",
    title: "Quizzes & Tech Games",
    slug: "quizzes-tech-games",
    dbValue: "Quizzes and Tech Games",
    description: "Test your trivia. It's not just what you know, but how fast you can recall it.",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
  },
  {
    id: "creative-design",
    title: "Creative & Design",
    slug: "creative-design",
    dbValue: "Creative and Design",
    description: "UI/UX face-offs and digital art. Where aesthetics meet functionality.",
    gradient: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    id: "gaming-zone",
    title: "Gaming Zone",
    slug: "gaming-zone",
    dbValue: "Gaming Zone",
    description: "Valorant, FIFA, and Tekken tournaments for ultimate bragging rights.",
    gradient: "from-indigo-500 via-blue-500 to-cyan-500",
  },

];

export function getCategoryBySlug(slug: string): EventCategory | undefined {
  return EVENT_CATEGORIES.find(cat => cat.slug === slug);
}

export function getCategoryById(id: string): EventCategory | undefined {
  return EVENT_CATEGORIES.find(cat => cat.id === id);
}
