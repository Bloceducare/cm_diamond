"use client";
import Image from "next/image";
import hero from "../../public/guest/3d.png";
import { Button } from "../ui/button";
import { MdRocketLaunch } from "react-icons/md";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  const handleAppLaunch = () => {
    router.push("/programme");
  };
  return (
    <section className="w-full mt-20 lg:h-[550px] md:h-[450px] grid md:grid-cols-2 gap-6 md:gap-0 lg:px-16 px-4 lg:py-12 md:py-0 py-10">
      <main className="md:h-full flex flex-col order-2 md:order-1 justify-center items-start md:gap-8 gap-4 md:pr-8">
        <h1 className="lg:text-5xl md:text-3xl text-2xl text-color2 font-bold">
          Efficient Student Management and Attendance Made Easy
        </h1>
        <p className="text-color3 md:text-lg">
          Unlock the Power of Seamless Student Management and Attendance:
          Simplify Administrative Tasks, Boost Productivity, and Foster Academic
          Success
        </p>
        <Button
          type="button"
          className="text-white bg-color1 hover:bg-color2 flex items-center gap-1"
          onClick={handleAppLaunch}
        >
          Launch App <MdRocketLaunch className="text-xl" />
        </Button>
      </main>
      <main className="md:h-full flex flex-col order-1 md:order-2 justify-center items-center">
        <div className="w-full lg:h-[500px] md:h-[400px]">
          <Image
            src={hero}
            alt="HeroImage"
            width={948}
            height={912}
            quality={100}
            className="w-full h-full object-contain"
            priority
          />
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
