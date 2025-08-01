import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAVBAR_CONSTANT } from "@/components/ui/Navbar/constant";
import Courses from "@/components/Courses/Courses";
import ChakravyuhEnglish from "@/components/Courses/ChakravyuhKaTod";
import ChakravyuhHindi from "@/components/Courses/ChakravyuhKaTodHindi";
import KurukshetraNew from "@/components/Courses/KurukshetraNew";
import ChakravyuhNew from "@/components/Courses/ChakravyuhKaTodNew";
import ChakravyuhKurukshetra from "@/components/Courses/chakravyuhKurukshetra";

// Define the expected params type
type Params = {
  course: string;
};

// Define the props type for the page
type Props = {
  params: Promise<Params>; // Use Promise for dynamic route params
  searchParams: Promise<Record<string, string | string[] | undefined>>; // Use Promise for searchParams
};

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course } = await params; // Await the params Promise

  // Default metadata if no course is provided
  if (!course) {
    return {
      title: "Kurukshetra- Win The Battle: Conquer the Stock Market",
      description:
        "Master technical analysis & stock investing with the Kurukshetra Win the Battle course. 5+ hrs content, expert insights & strategies. Join 10,526+ students! Enroll now",
    };
  }

  // Metadata map for specific courses
  const metadataMap: Record<string, Metadata> = {
    kurukshetra: {
      title: "Kurukshetra- Win The Battle: Conquer the Stock Market",
      description:
        "Master technical analysis & stock investing with the Kurukshetra Win the Battle course. 5+ hrs content, expert insights & strategies. Join 10,526+ students! Enroll now",
    },
    "chakravyuh-Ka-Tod-english": {
      title: "Renko Chart English",
      description:
        "Chakravyuh Ka Tod – Master the Power of Renko Charts English",
    },
    "chakravyuh-Ka-Tod-hindi": {
      title: "Renko Chart Hindi",
      description: "Chakravyuh Ka Tod – Master the Power of Renko Charts Hindi",
    },
    "kurukshetra-new": {
      title: "Kurukshetra- Win The Battle: Conquer the Stock Market",
      description:
        "Master technical analysis & stock investing with the Kurukshetra Win the Battle course. 5+ hrs content, expert insights & strategies. Join 10,526+ students! Enroll now",
    },
  };

  // Return metadata for the course or default
  return (
    metadataMap[course] || {
      title: "Kurukshetra- Win The Battle: Conquer the Stock Market",
      description:
        "Master technical analysis & stock investing with the Kurukshetra Win the Battle course. 5+ hrs content, expert insights & strategies. Join 10,526+ students! Enroll now",
    }
  );
}

// Page component
export default async function CoursesPage({ params }: Props) {
  const { course } = await params; // Await the params Promise

  const service = NAVBAR_CONSTANT.find(
    (group) => group.title === "Courses"
  )?.items.find((item) => item.href.endsWith(course));

  if (!service) {
    notFound();
  }

  return (
    <div>
      {course === "chakravyuh-Ka-Tod-english" ? (
        <ChakravyuhEnglish />
      ) : course === "chakravyuh-Ka-Tod-hindi" ? (
        <ChakravyuhHindi />
      ) : course === "kurukshetra-new" ? (
        <KurukshetraNew />
      ) : course === "chakravyuh-new" ? (
        <ChakravyuhNew />
      ) : course === "chakravyuh-kurukshetra" ? (
        <ChakravyuhKurukshetra />
      ) : (
        <Courses />
      )}
    </div>
  );
}
