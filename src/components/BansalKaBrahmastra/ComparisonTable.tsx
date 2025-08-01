import Image from "next/image";
import { features } from "./ComparisonContent";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const ComparisonTable = () => {
  // Transform feature titles and content for display
  const transformedFeatures = features.map((feature) => ({
    title: feature.title,
    bansalSupport: feature.hearzapSupport
      ? feature.title === "Future Version Access"
        ? "Nominal Cost"
        : "Yes"
      : "No",
    otherSupport: feature.otherBrandsSupport
      ? "Yes"
      : feature.title === "Proven Algo-Based"
      ? "Often Generic"
      : feature.title === "Trading View + Chartlink Compatible"
      ? "Sometimes Limited"
      : feature.title === "1-Month Telegram"
      ? "None"
      : feature.title === "Future Version Access"
      ? "Not Applicable"
      : "No",
  }));

  // Define which values should get a tick or X icon
  const isPositiveResponse = (value: string) =>
    value === "Yes" ||
    value === "Nominal Cost" ||
    value === "Sometimes Limited";
  return (
    <section className="w-full bg-primary/5 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 flex flex-col sm:flex-row justify-center items-center gap-1">
            <Image
              src="/images/bhrahmastra.png"
              alt="Modern hearing aid device"
              width={200}
              height={180}
              className="object-contain md:hidden"
              priority
            />
            <Image
              src="/images/bhrahmastra.png"
              alt="Modern hearing aid device"
              width={250}
              height={180}
              className="object-contain hidden md:block"
              priority
            />{" "}
            Vs
            <span className="mt-1 text-primary font-montserrat">
              {" "}
              Other Scanners
            </span>
          </h2>
          <p className="text-foreground/80 text-xl font-inter">
            Explore Dr. Rakesh Bansal's premier trading comparison table.
          </p>
        </div>

        <div className="comparison-table grid grid-cols-3 gap-4">
          <div className="heading font-extrabold text-base sm:text-xl text-foreground font-poppins">
            Features
          </div>

          <div className="hearzap-heading flex flex-col items-center">
            <Image
              src="/images/logo.webp"
              alt="Amplifon Logo"
              width={80}
              height={30}
              priority
              className="mx-auto mb-2"
            />
            <div className="heading font-extrabold text-base sm:text-xl text-foreground font-poppins text-center">
              Bansal Ka Bhrahmastra
            </div>
          </div>
          <div className="heading font-extrabold text-base sm:text-xl text-foreground font-poppins text-center">
            Other Scanners
          </div>

          {transformedFeatures.map((feature, index) => (
            <div key={index} className="contents">
              <div className="feature text-sm sm:text-base text-foreground font-inter py-2">
                {feature.title}
              </div>
              <div className="hearpaz py-2 flex items-start justify-start">
                <span className="mr-2">
                  {isPositiveResponse(feature.bansalSupport) ? (
                    <FaCheckCircle className="text-accent size-5" />
                  ) : (
                    <MdCancel className="text-destructive size-5" />
                  )}
                </span>
                <span
                  className={`text-lg font-inter ${
                    isPositiveResponse(feature.bansalSupport)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feature.bansalSupport}
                </span>
              </div>
              <div className="other-brand text-center py-2 flex items-start justify-start">
                <span className="mr-2">
                  {isPositiveResponse(feature.otherSupport) ? (
                    <FaCheckCircle className="text-accent size-5" />
                  ) : (
                    <MdCancel className="text-destructive size-5" />
                  )}
                </span>
                <span
                  className={`text-lg font-inter ${
                    isPositiveResponse(feature.otherSupport)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {feature.otherSupport}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
