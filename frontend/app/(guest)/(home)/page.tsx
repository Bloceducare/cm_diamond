import Approach from "@/components/home/Approach";
import Features from "@/components/home/Features";
import HeroSection from "@/components/home/HeroSection";
import NewsLetter from "@/components/home/NewsLetter";
import Partnership from "@/components/home/Partnership";
import Stats from "@/components/home/Stats";

export default function Home() {
  return (
    <main className="w-full flex min-h-screen flex-col overflow-x-hidden">
      <HeroSection />
      <Partnership />
      <Approach />
      <Features />
      <Stats />
      <NewsLetter />
    </main>
  );
}
