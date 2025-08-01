export interface NavItem {
  id: string;
  name: string;
  href: string;
  isPdf?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAVBAR_CONSTANT: NavGroup[] = [
  {
    title: "Home",
    items: [
      {
        id: "home",
        name: "Home",
        href: "/",
      },
    ],
  },
  {
    title: "Subscriptions",
    items: [
      {
        id: "subscriptions",
        name: "Subscriptions",
        href: "/subscriptions",
      },
    ],
  },
  {
    title: "Courses",
    items: [
      {
        id: "bansal-ka-brahmastra",
        name: "Bansal Ka Brahmastra",
        href: "/courses/bansal-ka-brahmastra",
      },
      {
        id: "kurukshetra-new",
        name: "Kurukshetra: Win the battle",
        href: "/courses/kurukshetra-new",
      },
      {
        id: "chakravyuh-new",
        name: "Chakravyuh Ka Tod",
        href: "/courses/chakravyuh-new",
      },
      {
        id: "chakravyuh-kurukshetra",
        name: "Kurukshetra + Chakravyuh Ka Tod",
        href: "/courses/chakravyuh-kurukshetra",
      },
    ],
  },
  {
    title: "About Us",
    items: [
      {
        id: "about-dr-rakesh-bansal",
        name: "About Dr. Rakesh Bansal",
        href: "/about-us",
      },
      {
        id: "events",
        name: "Events",
        href: "/events",
      },
      {
        id: "blogs",
        name: "Blogs",
        href: "/blogs",
      },
    ],
  },
  {
    title: "Disclaimer",
    items: [
      {
        id: "disclaimer",
        name: "Disclaimer",
        href: "/disclaimer",
      },
      {
        id: "privacy-policy",
        name: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        id: "terms-and-conditions",
        name: "Terms and Conditions",
        href: "/terms-conditions",
      },
      {
        id: "sebi-mitc",
        name: "SEBI Terms and Conditions",
        href: "/sebi-terms-conditions",
      },
      {
        id: "customer-grievances",
        name: "Customer Grievances",
        href: "/customer-grievances",
      },
      {
        id: "investor-charter",
        name: "Investor Charter",
        href: "https://learnrkb.in/iamrakeshbansal/investor-charter.pdf",
        isPdf: true,
      },
    ],
  },
  {
    title: "Contact Us",
    items: [
      {
        id: "contact-us",
        name: "Contact Us",
        href: "/contact-us",
      },
      {
        id: "feedback-form",
        name: "Feedback Form",
        href: "https://docs.google.com/forms/d/e/1FAIpQLScbFTo1a56fkSEYXrKZevHEtuClx9WS9l5Xd3gXjdfoI-GwCg/viewform",
      },
    ],
  },
];
