import React from "react";
import { getEventsMediaData } from "@/lib/events-media/api";
import {
  EventCard,
  VideoSlider,
  AnimatedSection,
  BansalGallery,
  HeroSection,
} from "./EventsClient";

export default async function EventsPage() {
  const mediaData = await getEventsMediaData();

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection banners={mediaData.banners} />

      {/* Recent Events Section */}
      <AnimatedSection>
        <section className="py-16 px-4 md:px-8 bg-white">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-800">
            Recent Events
          </h2>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mediaData.recentEvents.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Professional Event Gallery Section */}
      <AnimatedSection>
        <section id="gallery" className="py-16 px-4 md:px-8 bg-gray-100">
          <div className="text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-green-200 relative">
              Event Gallery
              <span className="absolute inset-0 text-opacity-10 text-green-200">
                Event Gallery
              </span>
            </h2>
          </div>
          <div className="container">
            <BansalGallery
              ahmedabadEvents={mediaData.ahmedabadEvents}
              delhiEvents={mediaData.delhiEvents}
            />
          </div>
        </section>
      </AnimatedSection>

      {/* Video Showcase Section */}
      <AnimatedSection>
        <section id="videos" className="py-16 px-4 md:px-8 bg-white">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-800">
            Event Highlights
          </h2>
          <div className="container">
            <VideoSlider videos={mediaData.videos} />
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
