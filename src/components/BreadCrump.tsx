
export default function BreadCrump() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Master Power of Renko Charts Only @4000",
        "item": "https://www.iamrakeshbansal.com/courses/chakravyuh-Ka-Tod-hindi"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Trading Technical Analysis course only @11,99",
        "item": "https://www.iamrakeshbansal.com/courses/kurukshetra"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Intraday/BTST Service ON @999",
        "item": "https://www.iamrakeshbansal.com/subscriptions/intraday-btst-plan"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Mentorship Service ONLY @3800",
        "item": "https://www.iamrakeshbansal.com/subscriptions/mentorship-plan"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Commodity Service Only @3,500",
        "item": "https://www.iamrakeshbansal.com/subscriptions/commodity-plan"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "About SEBI Registered Dr. Rakesh Bansal",
        "item": "https://www.iamrakeshbansal.com/about-us"
      }
    ]
  };

  return (
    
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
   
  );
}
