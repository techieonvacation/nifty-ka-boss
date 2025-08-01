export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  featured: boolean;
  tags: string[];
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Bansal Ka Brahmastra",
    slug: "bansal-ka-brahmastra",
    description:
      "Master the ultimate trading strategies with our flagship course designed by expert trader Bansal.",
    image: "/placeholder.svg?height=600&width=800",
    duration: "12 weeks",
    price: 29999,
    originalPrice: 39999,
    rating: 4.9,
    students: 5240,
    featured: true,
    tags: ["Advanced", "Options Trading"],
  },
  {
    id: "2",
    title: "Chakravyuh",
    slug: "chakravyuh",
    description:
      "Navigate complex market patterns and break through trading barriers with strategic approaches.",
    image: "/placeholder.svg?height=600&width=800",
    duration: "8 weeks",
    price: 19999,
    originalPrice: 24999,
    rating: 4.7,
    students: 3180,
    featured: false,
    tags: ["Intermediate", "Technical Analysis"],
  },
  {
    id: "3",
    title: "Kurukshetra",
    slug: "kurukshetra",
    description:
      "Prepare for the battlefield of trading with tactical strategies to conquer volatile markets.",
    image: "/placeholder.svg?height=600&width=800",
    duration: "10 weeks",
    price: 24999,
    originalPrice: 29999,
    rating: 4.8,
    students: 4120,
    featured: true,
    tags: ["Advanced", "Risk Management"],
  },
  {
    id: "4",
    title: "Chakravyuh-Kurukshetra Combo",
    slug: "chakravyuh-kurukshetra",
    description:
      "The ultimate combination package offering comprehensive trading education from basics to mastery.",
    image: "/placeholder.svg?height=600&width=800",
    duration: "16 weeks",
    price: 39999,
    originalPrice: 49999,
    rating: 4.9,
    students: 2890,
    featured: true,
    tags: ["Bundle", "Complete System"],
  },
  {
    id: "5",
    title: "Intraday Mastery",
    slug: "intraday-mastery",
    description:
      "Specialized techniques for day traders to maximize profits within market hours.",
    image: "/placeholder.svg?height=600&width=800",
    duration: "6 weeks",
    price: 14999,
    originalPrice: 19999,
    rating: 4.6,
    students: 3750,
    featured: false,
    tags: ["Specialized", "Intraday"],
  },
  {
    id: "6",
    title: "Options Strategies Pro",
    slug: "options-strategies-pro",
    description:
      "Advanced options trading techniques for consistent income generation in any market condition.",
    image: "/placeholder.svg?height=600&width=800",
    duration: "8 weeks",
    price: 22999,
    originalPrice: 27999,
    rating: 4.8,
    students: 2980,
    featured: false,
    tags: ["Advanced", "Options"],
  },
];
