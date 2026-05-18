"use client";
import Image from "next/image";
import { HeroSection } from "./_components/hero-section";
import { FeaturedAuthors } from "./_components/featured-authores";
import { StartBlogging } from "./_components/start-blogging";
import { MetricsSection } from "./_components/MetricSection";
import { WhyUsSection } from "./_components/WhyUs";
import TrendingBlogs from "./_components/TrendingBlogs";
export default function Home() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <div className="max-w-[1400px] mx-auto space-y-16 scroll-mt-20" id="trending">
        <TrendingBlogs/>
        <div className="md:flex items-end">
          <MetricsSection />
        </div>
        <WhyUsSection />
        <StartBlogging />
      </div>
    </div>
  );
}
